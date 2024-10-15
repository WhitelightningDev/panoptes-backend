const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId) => {
  // Create a token with the user ID as payload
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { generateToken };
