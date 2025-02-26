
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const threatsRoutes = require("./routes/threatRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
app.use(express.json());
app.use(cors());        // ✅ Now it's safe to use

mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/threats", threatsRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
