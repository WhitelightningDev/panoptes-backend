const User = require("../models/User"); // Adjust the path as necessary
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/tokenService"); // Adjust the path as necessary

// Function to sign up a new user
exports.signup = async (req, res) => {
  const { name, surname, contact, email, password } = req.body;

  try {
    // Check if the user already exists by name, surname, or email
    const existingUser = await User.findOne({
      $or: [{ name: name }, { surname: surname }, { email: email }],
    });

    if (existingUser) {
      return res.status(200).json({ exists: true }); // User exists
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      surname,
      contact,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error during user signup:", error); // Log the error for debugging
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Function to check if a user already exists
exports.checkUserExists = async (req, res) => {
  const { name, surname, email } = req.body;

  try {
    // Check if the user already exists by name, surname, or email
    const existingUser = await User.findOne({
      $or: [{ name }, { surname }, { email }],
    });

    if (existingUser) {
      return res.status(200).json({ exists: true }); // User exists
    }
    return res.status(200).json({ exists: false }); // User does not exist
  } catch (error) {
    console.error("Error checking user existence:", error); // Log the error for debugging
    res.status(500).json({ message: "Error checking user existence", error });
  }
};

// Function to log in a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email
    const user = await User.findOne({ email });
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
    console.error("Error during user login:", error); // Log the error for debugging
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Function to update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, surname, contact, email } = req.body;

  try {
    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, surname, contact, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    console.error("Error during user update:", error); // Log the error for debugging
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
    console.error("Error during user deletion:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting user", error });
  }
};
