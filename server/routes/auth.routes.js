const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, save } = require("../data");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "taskflow_secret_key_demo_2026";

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required.",
      });
    }

    if (!["assigner", "viewer"].includes(role)) {
      return res.status(400).json({
        message: "Role must be assigner or viewer.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email: normalizedEmail,
      passwordHash,
      role,
    };

    users.push(newUser);
    save();

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during login.",
    });
  }
});

// Update Profile (Name)
router.put("/profile", authenticateToken, (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    user.name = name.trim();
    save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile." });
  }
});

// Update Password
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating password." });
  }
});

// Get current user details
router.get("/me", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (user) {
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(200).json({ user: req.user });
  }
});

// Get all viewers (for assignment selection)
router.get("/viewers", authenticateToken, (req, res) => {
  const viewers = users
    .filter((u) => u.role === "viewer")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    }));
  res.status(200).json(viewers);
});

module.exports = router;
