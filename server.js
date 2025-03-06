const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", contactRoutes);

// Default route to check if backend is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server only if NOT running on Vercel (for local dev)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5004;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
