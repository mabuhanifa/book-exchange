const mongoose = require("mongoose");

const sellTransactionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User selling the book
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User buying the book
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being sold
    price: { type: Number, required: true, min: 0 }, // Price at the time of transaction
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    }, // 'pending' when buyer initiates
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    }, // Mocked: 'paid' implies cash on delivery agreed
    sellerConfirmedCompletion: { type: Boolean, default: false },
    buyerConfirmedCompletion: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SellTransaction = mongoose.model(
  "SellTransaction",
  sellTransactionSchema
);

module.exports = SellTransaction;
