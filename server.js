const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", contactRoutes);

// Default route to check if backend is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Port (Vercel doesn't need manual port setting)
module.exports = app;
