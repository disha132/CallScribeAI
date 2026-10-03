const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const callRecordingRoutes = require("./routes/callRecordingRoutes");

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/call-recordings", callRecordingRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CallScribe AI Backend is running 🚀",
  });
});

module.exports = app;
