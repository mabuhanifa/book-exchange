const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const asyncHandler = require("express-async-handler"); // Helper for async route handlers

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Access token expiry
  });
};

// Helper function to generate Refresh Token
const generateRefreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    // Using same secret for simplicity, consider a different one
    expiresIn: "7d", // Refresh token expiry
  });
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  return { token, expires };
};

// Helper function to send OTP (Mock Implementation)
const sendOTP = async (phoneNumber, otp) => {
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  // TODO: Integrate with a real SMS/OTP service provider here
  return true; // Simulate success
};

// @desc    Initiate User Registration (Send OTP)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  // Basic validation
  if (!phoneNumber) {
    res.status(400);
    throw new Error("Please provide a phone number");
  }
  // TODO: Add more robust phone number format validation

  const userExists = await User.findOne({ phoneNumber });

  if (userExists && userExists.isVerified) {
    res.status(400);
    throw new Error("User already registered and verified");
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  let user;
  if (userExists && !userExists.isVerified) {
    // Update existing unverified user
    user = userExists;
    user.otp = otp; // Pre-save hook will hash it
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    // Create new user (unverified)
    user = await User.create({
      phoneNumber,
      otp, // Pre-save hook will hash it
      otpExpires,
      isVerified: false,
      role: "user", // Default role
      // Name and Area will be added during profile completion (step 2)
    });
  }

  if (user) {
    // Send OTP (Mock)
    await sendOTP(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to phone number",
      userId: user._id, // Optionally return user ID for next step
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Verify OTP and Complete Registration/Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    res.status(400);
    throw new Error("Please provide phone number and OTP");
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if OTP is expired
  if (user.otpExpires < new Date()) {
    // Clear expired OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(400);
    throw new Error("OTP expired");
  }

  // Check if OTP is correct
  const isMatch = await user.matchOTP(otp);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // OTP is correct, verify user and clear OTP fields
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Generate tokens
  const accessToken = generateToken(user._id);
  const { token: refreshToken, expires: refreshTokenExpires } =
    generateRefreshToken(user._id);

  // Save refresh token
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expires: refreshTokenExpires,
  });

  res.status(200).json({
    success: true,
    message: user.name
      ? "Login successful"
      : "Verification successful, complete profile",
    accessToken,
    refreshToken,
    user: {
      // Return basic user info
      _id: user._id,
      phoneNumber: user.phoneNumber,
      isVerified: user.isVerified,
      role: user.role,
      name: user.name, // Will be null if profile not completed
      area: user.area, // Will be null if profile not completed
    },
  });
});

// @desc    Initiate User Login (Send OTP)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Please provide a phone number");
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(404);
    throw new Error("User not found. Please register.");
  }

  if (!user.isVerified) {
    // If user exists but is not verified, resend OTP for verification
    // This handles cases where registration was started but not completed
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    user.otp = otp; // Pre-save hook will hash it
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: "User not verified. OTP sent for verification.",
      userId: user._id,
    });
  } else {
    // User is verified, send OTP for login
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    user.otp = otp; // Pre-save hook will hash it
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent for login",
      userId: user._id,
    });
  }
});

// @desc    Refresh Access Token using Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh token not provided");
  }

  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
  }).populate("user");

  if (!storedToken || !storedToken.user) {
    res.status(403);
    throw new Error("Invalid or expired refresh token");
  }

  // Check if refresh token is expired
  if (storedToken.expires < new Date()) {
    await storedToken.remove(); // Remove expired token
    res.status(403);
    throw new Error("Refresh token expired. Please login again.");
  }

  // Verify the token signature (optional, as expiry is checked, but good practice)
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    await storedToken.remove(); // Remove invalid token
    res.status(403);
    throw new Error("Invalid refresh token signature. Please login again.");
  }

  // Generate new access token
  const newAccessToken = generateToken(storedToken.user._id);

  // Optional: Implement refresh token rotation (generate new refresh token and invalidate old one)
  // const { token: newRefreshToken, expires: newRefreshTokenExpires } = generateRefreshToken(storedToken.user._id);
  // await storedToken.remove(); // Invalidate old refresh token
  // await RefreshToken.create({
  //   user: storedToken.user._id,
  //   token: newRefreshToken,
  //   expires: newRefreshTokenExpires,
  // });

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
    // refreshToken: newRefreshToken // Return new refresh token if rotation is implemented
  });
});

// @desc    Invalidate Refresh Token (Logout)
// @route   POST /api/auth/logout
// @access  Private (Requires access token to identify user)
const logoutUser = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware
  const userId = req.user._id;

  // Remove all refresh tokens for this user (or just the specific one if sent in body)
  await RefreshToken.deleteMany({ user: userId });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400);
    throw new Error("Please provide a phone number");
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    // If user is already verified, this might be a login flow resend
    // Or you might restrict resend only for unverified users
    // For now, allow resend for both login and registration flows
  }

  // Generate new OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  user.otp = otp; // Pre-save hook will hash it
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP (Mock)
  await sendOTP(phoneNumber, otp);

  res.status(200).json({
    success: true,
    message: "New OTP sent to phone number",
    userId: user._id,
  });
});

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  refreshAccessToken,
  logoutUser,
  resendOTP,
};
