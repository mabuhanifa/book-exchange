const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User initiating the request
    requesterBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    }, // Book offered by requester
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User who owns the target book
    ownerBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    }, // Book requested from owner
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    message: { type: String, maxlength: 500 }, // Optional message with the request
    requesterConfirmedCompletion: { type: Boolean, default: false },
    ownerConfirmedCompletion: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ExchangeRequest = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema
);

module.exports = ExchangeRequest;
