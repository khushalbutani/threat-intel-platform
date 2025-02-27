require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const logger = require("./Utils/logger");

const taxiiRoutes = require("./routes/taxiiRoutes");
const authRoutes = require("./routes/authRoutes");
const threatsRoutes = require("./routes/threatRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const privacyRoutes = require("./routes/privacyRoutes"); // Import privacy routes

const { analyzeThreats } = require("./threatAnalysis");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Mount API routes with specific prefixes
app.use("/api/auth", authRoutes);
app.use("/api/threats", threatsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/privacy", privacyRoutes);
app.use("/api", taxiiRoutes);

// Sample Threat Data (Replace with MongoDB fetch in production)
const threats = [
  { id: 1, name: "Trojan Attack", type: "malware", severity: "high", occurrences: 15 },
  { id: 2, name: "Phishing Email", type: "phishing", severity: "medium", occurrences: 8 },
];

// API Endpoint for Threat Analysis
app.get("/api/threats", (req, res) => {
  const analyzedThreats = analyzeThreats(threats);
  res.json(analyzedThreats);
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Logging Middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Start the server (use a single app.listen)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
