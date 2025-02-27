const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require("dotenv").config();

const ThreatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  source: { type: String, required: true },
  dateDetected: { type: Date, default: Date.now },
});

ThreatSchema.plugin(encrypt, {
  secret: process.env.ENCRYPTION_KEY,
  encryptedFields: ["description"],
});

module.exports = mongoose.model("Threat", ThreatSchema);
