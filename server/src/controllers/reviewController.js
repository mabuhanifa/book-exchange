const Review = require("../models/Review");
const User = require("../models/User");
const ExchangeRequest = require("../models/ExchangeRequest");
const SellTransaction = require("../models/SellTransaction");
const BorrowRequest = require("../models/BorrowRequest");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility

// Helper to get transaction model by type
const getTransactionModel = (type) => {
  switch (type) {
    case "ExchangeRequest":
      return ExchangeRequest;
    case "SellTransaction":
      return SellTransaction;
    case "BorrowRequest":
      return BorrowRequest;
    default:
      return null;
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { transactionId, transactionType, rating, comment } = req.body;
  const reviewerId = req.user._id;

  // Basic validation
  if (
    !transactionId ||
    !transactionType ||
    rating === undefined ||
    rating === null
  ) {
    res.status(400);
    throw new Error(
      "Please provide transactionId, transactionType, and rating"
    );
  }
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }
  if (comment && comment.length > 1000) {
    res.status(400);
    throw new Error("Comment exceeds maximum length");
  }

  const TransactionModel = getTransactionModel(transactionType);
  if (!TransactionModel) {
    res.status(400);
    throw new Error("Invalid transaction type");
  }

  // Find the completed transaction
  const transaction = await TransactionModel.findById(transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Check if transaction is completed
  if (transaction.status !== "completed") {
    res.status(400);
    throw new Error(
      `Cannot review a transaction with status "${transaction.status}". It must be completed.`
    );
  }

  // Determine reviewee based on transaction type and reviewer
  let revieweeId;
  if (transactionType === "ExchangeRequest") {
    if (transaction.requester.toString() === reviewerId.toString()) {
      revieweeId = transaction.owner;
    } else if (transaction.owner.toString() === reviewerId.toString()) {
      revieweeId = transaction.requester;
    }
  } else if (transactionType === "SellTransaction") {
    if (transaction.buyer.toString() === reviewerId.toString()) {
      revieweeId = transaction.seller;
    } else if (transaction.seller.toString() === reviewerId.toString()) {
      revieweeId = transaction.buyer;
    }
  } else if (transactionType === "BorrowRequest") {
    if (transaction.borrower.toString() === reviewerId.toString()) {
      revieweeId = transaction.owner;
    } else if (transaction.owner.toString() === reviewerId.toString()) {
      revieweeId = transaction.borrower;
    }
  }

  // Ensure reviewer is a participant and not reviewing themselves
  if (!revieweeId || reviewerId.toString() === revieweeId.toString()) {
    res.status(403);
    throw new Error(
      "Not authorized to review this transaction or cannot review yourself"
    );
  }

  // Check if a review already exists for this transaction by this reviewer
  const existingReview = await Review.findOne({
    reviewer: reviewerId,
    transaction: transactionId,
    transactionModel: transactionType,
  });

  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this transaction");
  }

  const review = await Review.create({
    reviewer: reviewerId,
    reviewee: revieweeId,
    transaction: transactionId,
    transactionModel: transactionType,
    rating: parseInt(rating),
    comment,
  });

  // The post-save hook on the Review model will handle updating the reviewee's average rating

  // TODO: Send notification to the reviewee
  // await sendNotification(revieweeId, 'new_review', `You received a new review from ${req.user.name}`, review._id, 'Review');

  res
    .status(201)
    .json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
});

// @desc    Get reviews received by a specific user (Public)
// @route   GET /api/users/:userId/reviews
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const query = { reviewee: userId, isModerated: false }; // Only show non-moderated reviews

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  const reviews = await Review.find(query)
    .populate("reviewer", "name profileImageUrl") // Populate reviewer info
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitInt);

  const totalReviews = await Review.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total: totalReviews,
    page: parseInt(page),
    pages: Math.ceil(totalReviews / limitInt),
    data: reviews,
  });
});

// @desc    Get reviews written by the authenticated user (Private)
// @route   GET /api/users/me/reviews/given
// @access  Private
const getMyGivenReviews = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const query = { reviewer: reviewerId }; // User sees all reviews they wrote, even if moderated

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  const reviews = await Review.find(query)
    .populate("reviewee", "name area profileImageUrl") // Populate reviewee info
    .populate("transaction", "status") // Populate transaction status (optional)
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitInt);

  const totalReviews = await Review.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total: totalReviews,
    page: parseInt(page),
    pages: Math.ceil(totalReviews / limitInt),
    data: reviews,
  });
});

// @desc    Get details of a specific review
// @route   GET /api/reviews/:reviewId
// @access  Public (or Private/Participant only?) - Making public for now
const getReviewDetails = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId)
    .populate("reviewer", "name profileImageUrl")
    .populate("reviewee", "name area profileImageUrl")
    .populate("transaction"); // Populate transaction details

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Optional: Check if review is moderated and hide if policy dictates
  // if (review.isModerated && req.user?.role !== 'admin') {
  //     res.status(404); // Hide moderated reviews from non-admins
  //     throw new Error('Review not found');
  // }

  res.status(200).json({ success: true, data: review });
});

module.exports = {
  createReview,
  getUserReviews, // Used in userRoutes
  getMyGivenReviews, // Used in userRoutes
  getReviewDetails,
};
