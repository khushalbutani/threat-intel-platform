const express = require("express");
const { discoverTAXII } = require("../Utils/taxiiService");

const router = express.Router();

router.get("/taxii/discover", async (req, res) => {
  try {
    const data = await discoverTAXII();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TAXII discovery data" });
  }
});

module.exports = router;
