const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// 🔐 Secret Keys (Use Environment Variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret_key";

// Refresh token schema (Store in MongoDB instead of an array)
const refreshTokenSchema = new mongoose.Schema({
  token: String,
  userId: mongoose.Schema.Types.ObjectId,
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

// 🟢 Register Route
router.post(
  "/register",
  [
    body("username", "Username is required").notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      // Hashing password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role: "user" });

      await newUser.save();
      res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// 🔵 Login Route
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      // Generate Tokens
      const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

      // Store refresh token in DB
      await RefreshToken.create({ token: refreshToken, userId: user.id });

      res.cookie("access_token", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

      res.json({ msg: "Login successful", role: user.role, token: accessToken });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// 🟠 Refresh Token Route
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(403).json({ msg: "Unauthorized" });

  try {
    // Verify token and check if it exists in DB
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) return res.status(403).json({ msg: "Invalid Refresh Token" });

    // Generate new access token
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "15m" });
    res.cookie("access_token", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ msg: "Invalid Refresh Token" });
  }
});

// 🔴 Logout Route
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    // Remove refresh token from DB
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
