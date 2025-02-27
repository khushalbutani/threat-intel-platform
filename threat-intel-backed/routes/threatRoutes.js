const express = require("express");
const router = express.Router();
const Threat = require("../models/Threat");

// Get all threats with filters
router.get("/", async (req, res) => {
  try {
    const { severity, source, startDate, endDate } = req.query;
    let filter = {};

    if (severity) filter.severity = severity;
    if (source) filter.source = new RegExp(source, "i");
    if (startDate && endDate) {
      filter.dateDetected = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const threats = await Threat.find(filter).sort({ dateDetected: -1 });
    res.json(threats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
