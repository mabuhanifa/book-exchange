const User = require("../models/User");
const asyncHandler = require("express-async-handler");
// const upload = require('../middlewares/uploadMiddleware'); // Assuming Multer or similar for file uploads
// const { uploadImage, deleteImage } = require('../utils/imageUpload'); // Assuming image upload utility

// @desc    Get a specific user's public profile
// @route   GET /api/users/:userId
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    "-otp -otpExpires -password -role -isSuspended -suspendedReason -suspendedBy -suspendedAt"
  ); // Select public fields

  if (user && user.isVerified && !user.isSuspended) {
    res.status(200).json({ success: true, data: user });
  } else if (user && !user.isVerified) {
    res.status(404); // Or 403 depending on policy - hide unverified users?
    throw new Error("User not found or not verified");
  } else if (user && user.isSuspended) {
    res.status(404); // Hide suspended users from public view
    throw new Error("User not found");
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get the authenticated user's own profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the protect middleware and already excludes sensitive fields
  res.status(200).json({ success: true, data: req.user });
});

// @desc    Update the authenticated user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update allowed fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.area = req.body.area || user.area; // TODO: Validate area against a predefined list
    user.bio = req.body.bio || user.bio;

    // Prevent changing sensitive fields via this route
    if (
      req.body.phoneNumber ||
      req.body.role ||
      req.body.isVerified ||
      req.body.isSuspended
    ) {
      res.status(400);
      throw new Error("Cannot update sensitive fields via this route");
    }

    // Ensure user is verified before allowing profile completion fields (name, area)
    if (!user.isVerified && (req.body.name || req.body.area)) {
      res.status(400);
      throw new Error(
        "Please verify your account before completing your profile"
      );
    }

    // Require name and area once verified
    if (user.isVerified && (!user.name || !user.area)) {
      if (!req.body.name || !req.body.area) {
        res.status(400);
        throw new Error("Name and Area are required to complete your profile");
      }
      user.name = req.body.name;
      user.area = req.body.area;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        // Return updated public/semi-private fields
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        area: updatedUser.area,
        bio: updatedUser.bio,
        profileImageUrl: updatedUser.profileImageUrl,
        isVerified: updatedUser.isVerified,
        role: updatedUser.role,
        averageRating: updatedUser.averageRating,
        totalReviews: updatedUser.totalReviews,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Upload/update profile image for authenticated user
// @route   POST /api/users/me/profile-image
// @access  Private
const uploadProfileImage = asyncHandler(async (req, res) => {
  // TODO: Implement file upload logic here
  // Use a middleware like Multer to handle the file upload
  // Then use a utility function to upload to storage (e.g., S3, Cloudinary)
  // Update the user's profileImageUrl field

  // Example placeholder:
  // if (!req.file) {
  //   res.status(400);
  //   throw new Error('No image file uploaded');
  // }

  // const imageUrl = await uploadImage(req.file); // Implement this utility

  const user = await User.findById(req.user._id);

  if (user) {
    // Optional: Delete old image from storage if it exists
    // if (user.profileImageUrl) {
    //   await deleteImage(user.profileImageUrl); // Implement this utility
    // }

    // user.profileImageUrl = imageUrl; // Set the new image URL
    // await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      // profileImageUrl: imageUrl // Return the new image URL
      profileImageUrl: "placeholder_image_url", // Placeholder
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// --- Admin User Management (Placeholder - Full logic in Task 10) ---

// @desc    Get a list of all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // TODO: Implement filtering, searching, pagination
  const users = await User.find({}).select("-otp -otpExpires -password"); // Exclude sensitive fields

  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Suspend a user (Admin only)
// @route   PUT /api/admin/users/:userId/suspend
// @access  Private/Admin
const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  const { reason } = req.body; // Optional reason

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot suspend another admin");
  }

  if (user.isSuspended) {
    res.status(400);
    throw new Error("User is already suspended");
  }

  user.isSuspended = true;
  user.suspendedReason = reason || "Suspended by admin";
  user.suspendedBy = req.user._id; // Admin user ID from auth middleware
  user.suspendedAt = new Date();

  // TODO: Implement logic to cancel/pause user's active transactions, hide their listings, etc.

  await user.save();

  res
    .status(200)
    .json({
      success: true,
      message: `User ${user.phoneNumber} suspended`,
      data: user,
    });
});

// @desc    Restore a user (Admin only)
// @route   PUT /api/admin/users/:userId/restore
// @access  Private/Admin
const restoreUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.isSuspended) {
    res.status(400);
    throw new Error("User is not suspended");
  }

  user.isSuspended = false;
  user.suspendedReason = undefined;
  user.suspendedBy = undefined;
  user.suspendedAt = undefined;

  // TODO: Implement logic to potentially reactivate user's listings or transactions if appropriate

  await user.save();

  res
    .status(200)
    .json({
      success: true,
      message: `User ${user.phoneNumber} restored`,
      data: user,
    });
});

module.exports = {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  // Admin functions
  getAllUsers,
  suspendUser,
  restoreUser,
};
