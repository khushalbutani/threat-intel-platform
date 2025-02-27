// routes/privacyRoutes.js
const express = require("express");
const { encryptData, decryptData } = require("../services/privacyService");

const router = express.Router();

// Route to encrypt sensitive data
router.post("/encrypt", (req, res) => {
  try {
    const { sensitiveData } = req.body;
    const encrypted = encryptData(sensitiveData);
    res.json({ success: true, encrypted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Decryption endpoint
router.post("/decrypt", (req, res) => {
    try {
      const { encryptedData } = req.body;
      if (!encryptedData) {
        return res.status(400).json({ success: false, error: "encryptedData is required" });
      }
      const decrypted = decryptData(encryptedData);
      res.json({ success: true, decrypted });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
router.post("/anonymize", (req, res) => {
    try {
      const anonymizedData = anonymizeThreatData(req.body); // Define anonymizeThreatData in your service
      res.json({ success: true, data: anonymizedData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
module.exports = router;

