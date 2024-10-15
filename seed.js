const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

// Replace with your user model
const User = require("./models/User"); // Adjust the path to your User model

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected!");

    // Clear the existing users collection
    await User.deleteMany({}); // This will remove all existing users

    // Seed data
    const users = [
      {
        name: "John",
        surname: "Doe",
        username: "john.doe",
        contact: "1234567890",
        email: "john.doe@example.com",
        password: "password123", // Make sure to hash passwords in production
      },
      {
        name: "Jane",
        surname: "Smith",
        username: "jane.smith",
        contact: "0987654321",
        email: "jane.smith@example.com",
        password: "password123", // Make sure to hash passwords in production
      },
      // Add more user objects as needed
    ];

    // Insert seed data into the database
    await User.insertMany(users);
    console.log("Seed data inserted successfully");

    // Close the connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
