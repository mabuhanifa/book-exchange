const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    author: { type: String },
    edition: { type: String },
    condition: {
      type: String,
      enum: ["New", "Like New", "Very Good", "Good", "Acceptable"],
      required: true,
    },
    description: { type: String, maxlength: 1000 },
    transactionType: {
      type: String,
      enum: ["exchange", "sell", "borrow"],
      required: true,
      index: true,
    },
    images: [{ type: String }], // Array of image URLs
    expectedPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.transactionType === "sell";
      },
    },
    expectedExchangeBook: {
      type: String,
      required: function () {
        return this.transactionType === "exchange";
      },
    },
    borrowDuration: {
      type: Number,
      min: 1,
      required: function () {
        return this.transactionType === "borrow";
      },
    },
    isAvailable: { type: Boolean, default: true, index: true },
    area: { type: String, required: true, index: true }, // Inherited from owner's profile area
    status: {
      type: String,
      enum: ["active", "pending", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
