const mongoose = require("mongoose");

const ThreatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved"],
      default: "open",
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }], // Example: ["malware", "phishing", "DDoS"]
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

// Index for faster search on title and severity
ThreatSchema.index({ title: "text", severity: 1 });

module.exports = mongoose.model("Threat", ThreatSchema);
