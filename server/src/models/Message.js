const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, maxlength: 1000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have read this message
  },
  { timestamps: true }
);

// Add index for conversation and createdAt for efficient message retrieval
messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
