const axios = require("axios");

const TAXII_SERVER_URL = "https://cti-taxii.mitre.org/taxii"; // Example TAXII server

// Function to discover TAXII services
const discoverTAXII = async () => {
  try {
    const response = await axios.get(TAXII_SERVER_URL, {
      headers: {
        "Accept": "application/taxii+json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in TAXII discovery:", error.message);
    throw error;
  }
};

module.exports = { discoverTAXII };
