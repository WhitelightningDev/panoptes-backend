const jwt = require("jsonwebtoken");

// Your secret key
const secretKey = "your_jwt_secret_here"; // Replace this with your actual secret key

// Function to generate JWT token
const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" }); // Token valid for 1 hour
  return token;
};

// Example usage - replace with your actual user ID
const userId = "exampleUserId"; // Replace with the actual user ID
const token = generateToken(userId);
console.log("Generated JWT Token:", token);
