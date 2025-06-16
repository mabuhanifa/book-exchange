const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Auto-delete after 7 days
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
