const CryptoJS = require("crypto-js");

// Use environment variable for security
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

// Encrypt Data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt Data
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption Error:", error.message);
    return null; // Return null if decryption fails
  }
};

// Anonymize Threat Data
const anonymizeThreatData = (data) => {
  return {
    ipAddress: "XXX.XXX.XXX.XXX",
    userID: "ANONYMIZED",
    threat: data.threat,
  };
};

module.exports = { encryptData, decryptData, anonymizeThreatData };
