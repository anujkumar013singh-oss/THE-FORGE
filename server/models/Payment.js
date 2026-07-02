const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
