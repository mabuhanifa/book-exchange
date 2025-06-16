const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User requesting to borrow
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User who owns the book
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being borrowed
    requestedDuration: { type: Number, required: true, min: 1 }, // Duration in days requested by borrower
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "active",
        "overdue",
        "returned",
        "disputed",
      ],
      default: "pending",
      index: true,
    },
    borrowDate: { type: Date }, // Date when borrowing officially starts (marked by owner)
    dueDate: { type: Date }, // Calculated based on borrowDate and accepted duration
    returnDate: { type: Date }, // Date when book was returned (marked by owner)
    borrowerConfirmedReturn: { type: Boolean, default: false }, // Borrower confirms they returned
    ownerConfirmedReturn: { type: Boolean, default: false }, // Owner confirms they received
  },
  { timestamps: true }
);

const BorrowRequest = mongoose.model("BorrowRequest", borrowRequestSchema);

module.exports = BorrowRequest;
