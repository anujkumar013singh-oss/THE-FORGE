const express = require("express");
const authenticate = require("../middleware/auth.js");
const adminOnly = require("../middleware/admin.js");
const User = require("../models/User.js");
const Payment = require("../models/Payment.js");

const router = express.Router();

router.use(authenticate, adminOnly);

// GET /api/admin/clients
router.get("/clients", async (req, res) => {
  try {
    const clients = await User.find({ role: "member" }).select("-passwordHash -otp").sort({ createdAt: -1 });
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/payments/recent
router.get("/payments/recent", async (req, res) => {
  try {
    const payments = await Payment.find().populate("userId", "name email").sort({ date: -1 }).limit(50);
    res.json({ payments });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/expiring
router.get("/expiring", async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const clients = await User.find({
      role: "member",
      expiryDate: { $lte: threeDaysLater }
    }).select("name email phone expiryDate").sort({ expiryDate: 1 });
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/admin/clients/:id/membership
router.patch("/clients/:id/membership", async (req, res) => {
  try {
    const { joiningDate, expiryDate, duration } = req.body;
    const update = {};
    if (joiningDate) update.joiningDate = new Date(joiningDate);
    if (expiryDate) update.expiryDate = new Date(expiryDate);
    if (duration) update.duration = duration;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-passwordHash -otp");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/clients/:id/payments
router.post("/clients/:id/payments", async (req, res) => {
  try {
    const { amount, plan, date, status } = req.body;
    if (!amount || !plan) return res.status(400).json({ message: "Amount and plan are required" });
    const payment = await Payment.create({
      userId: req.params.id,
      amount: parseFloat(amount),
      plan,
      date: date ? new Date(date) : new Date(),
      status: status || "completed"
    });
    res.status(201).json({ payment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
