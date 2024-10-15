const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
const userRoutes = require("./routes/userRoutes"); // Adjust the path as necessary
require("dotenv").config(); // Load .env variables

const app = express();

// Enable CORS and allow all origins (whitelist every IP)
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB using the connection string from the .env file
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if there's a MongoDB connection failure
  });

// Use the user routes for handling CRUD operations
app.use("/api/users", userRoutes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack); // Log the error stack for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server, using the PORT from .env or defaulting to 5000
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Bind to all network interfaces
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
