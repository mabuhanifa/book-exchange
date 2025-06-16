const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // Array of 2 user IDs
    transaction: {
      // Link to the relevant transaction
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true, // One conversation per transaction
    },
    transactionModel: {
      type: String,
      required: true,
      enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
    }, // To know which model to populate
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Add index for participants for faster lookup
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
