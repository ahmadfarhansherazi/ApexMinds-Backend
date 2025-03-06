app.use("/api", contactRoutes);

// Default route to check if backend is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Port (Vercel doesn't need manual port setting)
module.exports = app;