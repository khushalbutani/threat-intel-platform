const express = require("express");
const Threat = require("../models/Threat");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 🟢 Get all threats with optional filters
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { severity, source, startDate, endDate } = req.query;
    let filter = {};

    if (severity) filter.severity = severity;
    if (source) filter.source = new RegExp(source, "i");
    if (startDate && endDate) {
      filter.dateDetected = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const threats = await Threat.find(filter)
      .populate("reportedBy", "username")
      .sort({ dateDetected: -1 });

    res.json(threats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔵 Create a new threat report
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, severity, source } = req.body;

    const newThreat = new Threat({
      title,
      description,
      severity,
      source,
      reportedBy: req.user.id,
      dateDetected: new Date(), // Ensure date is set when reported
    });

    await newThreat.save();
    res.status(201).json(newThreat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
