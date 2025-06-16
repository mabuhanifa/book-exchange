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

// @desc    Get reviews received by a specific user (Public)
// @route   GET /api/users/:userId/reviews
// @access  Public
// NOTE: Implementation is in reviewController.js, imported and used in userRoutes.js
// const getUserReviews = ...

// @desc    Get reviews written by the authenticated user (Private)
// @route   GET /api/users/me/reviews/given
// @access  Private
// NOTE: Implementation is in reviewController.js, imported and used in userRoutes.js
// const getMyGivenReviews = ...

module.exports = {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  // Admin functions moved to adminController.js
  // Review functions related to users are in reviewController.js
};
