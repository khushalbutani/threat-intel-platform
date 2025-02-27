// server/threatAnalysis.js

const analyzeThreat = (threat) => {
    let riskScore = 0;
  
    // Rule-based scoring system
    if (threat.type === "malware") riskScore += 50;
    if (threat.type === "phishing") riskScore += 30;
    if (threat.severity === "high") riskScore += 40;
    if (threat.occurrences > 10) riskScore += 20;
  
    // Ensure score does not exceed 100
    return Math.min(100, riskScore);
  };
  
  // Function to analyze all threats
  const analyzeThreats = (threats) => {
    return threats.map((threat) => ({
      ...threat,
      riskScore: analyzeThreat(threat),
    }));
  };
  
  module.exports = { analyzeThreats };
  