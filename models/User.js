const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensure that username is unique
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure that email is unique
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Basic email validation
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
