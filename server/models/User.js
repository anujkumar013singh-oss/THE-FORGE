const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["member", "admin"], default: "member" },
  joiningDate: { type: Date },
  expiryDate: { type: Date },
  duration: { type: String },
  discountApplied: { type: Number, default: 0 },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
