const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User receiving the notification
    type: {
      type: String,
      enum: [
        "new_message",
        "exchange_request_received",
        "exchange_request_status_changed", // accepted, rejected, cancelled, completed
        "sell_transaction_initiated",
        "sell_transaction_status_changed", // accepted, rejected, cancelled, completed
        "sell_transaction_payment_status_changed", // marked paid
        "borrow_request_received",
        "borrow_request_status_changed", // accepted, rejected, cancelled, active, overdue, returned
        "new_review",
        "admin_message", // System announcements
        // ... other types
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: [
        "Message",
        "ExchangeRequest",
        "SellTransaction",
        "BorrowRequest",
        "Review",
        "User",
        "System",
      ],
    }, // Type of entity related to the notification
    entityId: { type: mongoose.Schema.Types.ObjectId }, // ID of the related entity (e.g., message ID, request ID)
    message: { type: String, required: true }, // The notification text
    isRead: { type: Boolean, default: false, index: true },
    data: { type: mongoose.Schema.Types.Mixed }, // Optional data for deep linking or context
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
