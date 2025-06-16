const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true, // One dispute per transaction
    },
    transactionModel: {
      type: String,
      required: true,
      enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // Users involved in the dispute (usually 2)
    reason: { type: String, required: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    resolution: { type: String, maxlength: 1000 }, // Admin's resolution notes
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const Dispute = mongoose.model("Dispute", disputeSchema);

module.exports = Dispute;
