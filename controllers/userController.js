const User = require("../models/User"); // Adjust the path as necessary
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/tokenService"); // Adjust the path as necessary

// Function to sign up a new user
exports.signup = async (req, res) => {
  const { name, surname, username, contact, email, password } = req.body;

  try {
    // Check if the user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists!" });
    }

    // Optionally check if the username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username is already taken!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      surname,
      username,
      contact,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Function to log in a user
exports.login = async (req, res) => {
  const { email, password } = req.body; // Change to email instead of username

  try {
    // Check if the user exists by email
    const user = await User.findOne({ email }); // Find by email
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate a JWT token
    const token = generateToken(user._id); // Use the generateToken function

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Function to update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, surname, username, contact, email } = req.body;

  try {
    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, surname, username, contact, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Function to delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
