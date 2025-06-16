const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    otp: { type: String }, // Hashed OTP
    otpExpires: { type: Date },
    password: { type: String }, // Optional, if password login is added later
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    name: { type: String }, // Made optional initially for OTP-first flow
    email: { type: String, unique: true, sparse: true }, // Optional, unique if provided
    area: { type: String }, // Made optional initially, required for full profile
    profileImageUrl: { type: String }, // URL to stored image
    bio: { type: String, maxlength: 500 },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: { type: String },
    suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    suspendedAt: { type: Date },
    averageRating: {
      type: Number,
      default: 0,
      set: (v) => parseFloat(v.toFixed(1)),
    }, // Store with 1 decimal place
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Method to compare entered OTP with hashed OTP in DB
userSchema.methods.matchOTP = async function (enteredOTP) {
  // Assuming OTP is stored hashed
  return await bcrypt.compare(enteredOTP, this.otp);
};

// Method to compare entered password with hashed password in DB (if password login is added)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Check if password exists before comparing
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash OTP before saving (only if otp field is modified)
userSchema.pre("save", async function (next) {
  if (this.isModified("otp") && this.otp) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
  }
  // Hash password before saving (if password field is added and modified)
  // if (this.isModified('password') && this.password) {
  //   const salt = await bcrypt.genSalt(10);
  //   this.password = await bcrypt.hash(this.password, salt);
  // }
  next();
});

// No direct hook needed here for rating update, as it's triggered from Review model's post-save hook.
// The `set` function on `averageRating` ensures formatting.

const User = mongoose.model("User", userSchema);

module.exports = User;
