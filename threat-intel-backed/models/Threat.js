const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
});

const Threat = mongoose.models.Threat || mongoose.model("Threat", ThreatSchema);

module.exports = Threat;
