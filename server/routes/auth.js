const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User.js");
const { sendOTPEmail } = require("../utils/sendEmail.js");

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const user = await User.create({
      name, phone, email, passwordHash,
      otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });
    await sendOTPEmail(email, otp);
    res.status(201).json({ message: "OTP sent to email", userId: user._id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/verify-signup-otp
router.post("/verify-signup-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otp || user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, joiningDate: user.joiningDate, expiryDate: user.expiryDate, duration: user.duration } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No account with this email" });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/verify-reset-otp
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otp || user.otp.code !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: "OTP expired" });
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ message: "All fields required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.otp || user.otp.code !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ message: "OTP expired" });
    user.passwordHash = await bcrypt.hash(password, 12);
    user.otp = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
