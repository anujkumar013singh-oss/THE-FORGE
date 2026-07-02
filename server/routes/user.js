const express = require("express");
const authenticate = require("../middleware/auth.js");
const Payment = require("../models/Payment.js");
const User = require("../models/User.js");

const router = express.Router();

// GET /api/user/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash -otp");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/user/payments
router.get("/payments", authenticate, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
