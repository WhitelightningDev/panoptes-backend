const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Adjust the path as necessary

// Route for user signup
router.post("/signup", userController.signup);

// Route for user login
router.post("/login", userController.login);

// Route for updating user details
router.put("/update/:userId", userController.updateUser);

// Route for deleting a user
router.delete("/delete/:userId", userController.deleteUser);

module.exports = router;
