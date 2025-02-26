const express = require("express");
const Threat = require("../models/Threat");

const router = express.Router();

// Get total threat count
router.get("/total-threats", async (req, res) => {
  try {
    const count = await Threat.countDocuments();
    res.json({ totalThreats: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get threats count by severity
router.get("/threats-by-severity", async (req, res) => {
  try {
    const severityStats = await Threat.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);
    res.json(severityStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly threat trends
router.get("/monthly-trends", async (req, res) => {
  try {
    const monthlyStats = await Threat.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(monthlyStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
