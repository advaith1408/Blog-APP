const express = require("express");
const adminApp = express.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const { requireAuth } = require("@clerk/express");

// 🟢 Create or Validate Admin User
adminApp.post(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    const newUserAuthor = req.body;

    // Check if user exists
    const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

    if (userInDb !== null) {
      // Validate role
      if (newUserAuthor.role === userInDb.role) {
        return res.status(200).send({ message: newUserAuthor.role, payload: userInDb });
      } else {
        return res.status(400).send({ message: "Invalid role" });
      }
    }

    // Create new user
    const newUser = new UserAuthor(newUserAuthor);
    const newUserOrAuthorDoc = await newUser.save();
    res.status(201).send({ message: newUserOrAuthorDoc.role, payload: newUserOrAuthorDoc });
  })
);
adminApp.get("/users", async (req, res) => {
    try {
      const users = await UserAuthor.find(); // ✅ Use correct model
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
});

// 🟢 Block or Unblock a User/Author
// 🟢 Toggle User/Author Status (Block/Unblock)
adminApp.put(
  "/users/:id/status",
  expressAsyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const updatedUser = await UserAuthor.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "User status updated", payload: updatedUser });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  })
);

// 🟢 Unauthorized Access Route
adminApp.get("/unauthorized", (req, res) => {
  res.status(403).send({ message: "Unauthorized request" });
});

module.exports = adminApp;
