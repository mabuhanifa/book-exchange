const User = require("../models/User");
const Book = require("../models/Book");
const ExchangeRequest = require("../models/ExchangeRequest");
const SellTransaction = require("../models/SellTransaction");
const BorrowRequest = require("../models/BorrowRequest");
const Review = require("../models/Review");
const Dispute = require("../models/Dispute");
const Notification = require("../models/Notification"); // For sending admin notifications
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility
// const { getSystemLogs } = require('../utils/loggingService'); // Assuming logging utility

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

// @desc    Get aggregate system statistics (Admin only)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Basic stats - can be expanded
  const totalUsers = await User.countDocuments();
  const activeListings = await Book.countDocuments({ status: "active" });
  const pendingExchanges = await ExchangeRequest.countDocuments({
    status: "pending",
  });
  const pendingSales = await SellTransaction.countDocuments({
    status: "pending",
  });
  const pendingBorrows = await BorrowRequest.countDocuments({
    status: "pending",
  });
  const openDisputes = await Dispute.countDocuments({ status: "open" });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeListings,
      pendingTransactions: {
        exchange: pendingExchanges,
        sell: pendingSales,
        borrow: pendingBorrows,
      },
      openDisputes,
      // TODO: Add more stats like total transactions completed, users by area, etc.
    },
  });
});

// --- User Management ---

// @desc    Get a list of all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // TODO: Implement filtering, searching, pagination
  const users = await User.find({}).select("-otp -otpExpires -password"); // Exclude sensitive fields

  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get full details of a specific user (Admin only)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
const getFullUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    "-otp -otpExpires"
  ); // Include all fields except OTP/password

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // TODO: Optionally fetch related data like user's books, transactions, reviews, disputes

  res.status(200).json({ success: true, data: user });
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
  // This might involve finding all active transactions/books owned by this user and updating their status.

  await user.save();

  // TODO: Send notification to the suspended user
  // await createNotification(user._id, 'admin_message', `Your account has been suspended. Reason: ${user.suspendedReason}`, 'User', user._id);

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
  // This requires careful consideration of previous transaction states.

  await user.save();

  // TODO: Send notification to the restored user
  // await createNotification(user._id, 'admin_message', 'Your account has been restored.', 'User', user._id);

  res
    .status(200)
    .json({
      success: true,
      message: `User ${user.phoneNumber} restored`,
      data: user,
    });
});

// --- Book Management ---

// @desc    Get a list of all book listings (Admin only)
// @route   GET /api/admin/books
// @access  Private/Admin
const getAllBooks = asyncHandler(async (req, res) => {
  // TODO: Implement filtering, searching, pagination
  const books = await Book.find({}).populate("owner", "name phoneNumber area");

  res.status(200).json({ success: true, count: books.length, data: books });
});

// @desc    Delete a book listing (Admin only)
// @route   DELETE /api/admin/books/:bookId
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // TODO: Implement logic to cancel any pending/active transactions involving this book
  // TODO: Handle image deletion from storage

  await book.remove(); // Mongoose v6+, use deleteOne() in v7+

  // TODO: Send notification to the book owner
  // await createNotification(book.owner, 'admin_message', `Your book listing "${book.title}" has been removed by an admin.`, 'Book', book._id);

  res
    .status(200)
    .json({ success: true, message: "Book listing removed successfully" });
});

// --- Transaction Viewing ---

// @desc    Get a list of all transactions (Admin only)
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAllTransactions = asyncHandler(async (req, res) => {
  // TODO: Implement filtering (by type, status, user), searching, pagination
  // This requires querying multiple collections (ExchangeRequest, SellTransaction, BorrowRequest)
  // Could fetch all and combine/sort, or query each separately and combine.
  // Example fetching all SellTransactions:
  const sellTransactions = await SellTransaction.find({})
    .populate("seller", "name phoneNumber")
    .populate("buyer", "name phoneNumber")
    .populate("book", "title author");

  // Example fetching all ExchangeRequests:
  const exchangeRequests = await ExchangeRequest.find({})
    .populate("requester", "name phoneNumber")
    .populate("owner", "name phoneNumber")
    .populate("requesterBook", "title")
    .populate("ownerBook", "title");

  // Example fetching all BorrowRequests:
  const borrowRequests = await BorrowRequest.find({})
    .populate("borrower", "name phoneNumber")
    .populate("owner", "name phoneNumber")
    .populate("book", "title");

  // Combine and sort results (basic example)
  const allTransactions = [
    ...sellTransactions.map((t) => ({
      ...t.toObject(),
      type: "SellTransaction",
    })),
    ...exchangeRequests.map((t) => ({
      ...t.toObject(),
      type: "ExchangeRequest",
    })),
    ...borrowRequests.map((t) => ({ ...t.toObject(), type: "BorrowRequest" })),
  ].sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first

  // TODO: Implement pagination on the combined result or per type

  res
    .status(200)
    .json({
      success: true,
      count: allTransactions.length,
      data: allTransactions,
    });
});

// --- Dispute Management ---

// @desc    User flags a transaction as disputed (User-facing API, but handled here for context)
// @route   POST /api/disputes (Conceptual - could be PUT on transaction)
// @access  Private
const createDispute = asyncHandler(async (req, res) => {
  const { transactionId, transactionType, reason } = req.body;
  const userId = req.user._id;

  if (!transactionId || !transactionType || !reason) {
    res.status(400);
    throw new Error(
      "Please provide transactionId, transactionType, and reason"
    );
  }

  const TransactionModel = getTransactionModel(transactionType);
  if (!TransactionModel) {
    res.status(400);
    throw new Error("Invalid transaction type");
  }

  const transaction = await TransactionModel.findById(transactionId).populate(
    "seller buyer owner borrower"
  );

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Ensure user is a participant in the transaction
  let participants = [];
  if (transactionType === "ExchangeRequest") {
    participants = [transaction.requester, transaction.owner];
  } else if (transactionType === "SellTransaction") {
    participants = [transaction.seller, transaction.buyer];
  } else if (transactionType === "BorrowRequest") {
    participants = [transaction.owner, transaction.borrower];
  }

  if (!participants.some((p) => p.toString() === userId.toString())) {
    res.status(403);
    throw new Error("Not authorized to raise a dispute for this transaction");
  }

  // Check if a dispute already exists for this transaction
  const existingDispute = await Dispute.findOne({
    transaction: transactionId,
    transactionModel: transactionType,
  });
  if (existingDispute) {
    res.status(400);
    throw new Error("A dispute already exists for this transaction");
  }

  const dispute = await Dispute.create({
    transaction: transactionId,
    transactionModel: transactionType,
    raisedBy: userId,
    participants: participants.map((p) => p._id), // Store participant IDs
    reason,
    status: "open",
  });

  // TODO: Update transaction status to 'disputed'
  // transaction.status = 'disputed';
  // await transaction.save();

  // TODO: Notify admins about the new dispute
  // Find all admin users and send notification
  // const admins = await User.find({ role: 'admin' });
  // for (const admin of admins) {
  //     await createNotification(admin._id, 'admin_message', `New dispute raised for transaction ${transactionId}`, 'Dispute', dispute._id);
  // }

  res
    .status(201)
    .json({
      success: true,
      message: "Dispute raised successfully",
      data: dispute,
    });
});

// @desc    Get a list of all disputes (Admin only)
// @route   GET /api/admin/disputes
// @access  Private/Admin
const getAllDisputes = asyncHandler(async (req, res) => {
  // TODO: Implement filtering (by status, transaction type), searching, pagination
  const disputes = await Dispute.find({})
    .populate("raisedBy", "name phoneNumber")
    .populate("participants", "name phoneNumber")
    .populate("resolvedBy", "name phoneNumber")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: disputes.length, data: disputes });
});

// @desc    Get details of a specific dispute (Admin only)
// @route   GET /api/admin/disputes/:disputeId
// @access  Private/Admin
const getDisputeDetails = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.disputeId)
    .populate("raisedBy", "name phoneNumber")
    .populate("participants", "name phoneNumber")
    .populate("resolvedBy", "name phoneNumber")
    .populate("transaction"); // Populate the related transaction

  if (!dispute) {
    res.status(404);
    throw new Error("Dispute not found");
  }

  // TODO: Optionally fetch related chat messages for the transaction

  res.status(200).json({ success: true, data: dispute });
});

// @desc    Resolve a dispute (Admin only)
// @route   PUT /api/admin/disputes/:disputeId/resolve
// @access  Private/Admin
const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.disputeId);
  const { resolution, status } = req.body; // Admin provides resolution notes and final status

  if (!dispute) {
    res.status(404);
    throw new Error("Dispute not found");
  }

  if (dispute.status === "resolved" || dispute.status === "closed") {
    res.status(400);
    throw new Error("Dispute is already resolved or closed");
  }

  if (!resolution) {
    res.status(400);
    throw new Error("Resolution notes are required");
  }

  // Validate status update
  const validStatuses = ["resolved", "closed"]; // Admins can set to resolved or closed
  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(
      'Invalid or missing status for resolution. Must be "resolved" or "closed".'
    );
  }

  dispute.status = status;
  dispute.resolution = resolution;
  dispute.resolvedBy = req.user._id; // Admin user ID
  dispute.resolvedAt = new Date();

  // TODO: Implement logic to update the related transaction/books/users based on the resolution
  // This is the most complex part - depends on the specific resolution (e.g., cancel transaction, mark completed for one party, etc.)

  await dispute.save();

  // TODO: Notify participants about the dispute resolution
  // for (const participantId of dispute.participants) {
  //      await createNotification(participantId, 'admin_message', `Dispute for transaction ${dispute.transaction} has been resolved.`, 'Dispute', dispute._id, { resolution: resolution });
  // }

  res
    .status(200)
    .json({
      success: true,
      message: "Dispute resolved successfully",
      data: dispute,
    });
});

// --- Review Moderation (Moved from reviewController) ---

// @desc    Get all reviews (Admin only)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  // TODO: Implement filtering, searching, pagination
  const reviews = await Review.find({})
    .populate("reviewer", "name phoneNumber")
    .populate("reviewee", "name phoneNumber")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Moderate (e.g., hide, edit) a review (Admin only)
// @route   PUT /api/admin/reviews/:reviewId/moderate
// @access  Private/Admin
const moderateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  const { isModerated, moderationReason } = req.body;

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Ensure admin is performing the action (redundant with middleware but safe)
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to moderate reviews");
  }

  // Validate input
  if (isModerated === undefined) {
    res.status(400);
    throw new Error("isModerated field is required");
  }
  if (isModerated && !moderationReason) {
    // Optional: require reason if moderating
    // res.status(400);
    // throw new Error('Moderation reason is required when moderating a review');
  }

  review.isModerated = isModerated;
  review.moderationReason =
    moderationReason || (isModerated ? "Moderated by admin" : undefined);
  review.moderatedBy = req.user._id;
  review.moderatedAt = new Date();

  await review.save(); // The post-save hook on the Review model will handle recalculating the user's rating

  // TODO: Send notification to the reviewer and reviewee about moderation
  // await createNotification(review.reviewer, 'admin_message', `Your review has been moderated.`, 'Review', review._id);
  // await createNotification(review.reviewee, 'admin_message', `A review on your profile has been moderated.`, 'Review', review._id);

  res
    .status(200)
    .json({
      success: true,
      message: `Review ${
        review.isModerated ? "moderated" : "unmoderated"
      } successfully`,
      data: review,
    });
});

// --- System Logs & Reports ---

// @desc    Get system logs (Admin only)
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = asyncHandler(async (req, res) => {
  // TODO: Implement fetching logs from a logging service or file system
  // This is highly dependent on your logging setup (e.g., Winston, Pino, CloudWatch Logs)
  // Placeholder: return a simple message
  // const logs = await getSystemLogs(req.query); // Assuming utility takes query params for filtering/pagination

  res
    .status(501)
    .json({
      success: false,
      message: "System logs endpoint not yet implemented",
    });
});

// @desc    Generate basic reports (Admin only)
// @route   GET /api/admin/reports/:reportType
// @access  Private/Admin
const generateReport = asyncHandler(async (req, res) => {
  const { reportType } = req.params;
  // TODO: Implement different report types based on reportType param
  // Example: 'user-growth', 'transactions-by-area', 'most-reviewed-users'

  let reportData;
  let message = `Report "${reportType}" generated`;

  try {
    switch (reportType) {
      case "user-growth":
        // Example: Count users created per day/week/month
        // Requires aggregation pipeline
        reportData = await User.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);
        message = "User growth report generated";
        break;
      case "transactions-by-area":
        // Example: Count completed transactions per area
        // Requires joining transactions with books and users, then grouping
        res
          .status(501)
          .json({
            success: false,
            message: "Transactions by area report not yet implemented",
          });
        return; // Exit early
      // TODO: Add more report types
      default:
        res.status(400);
        throw new Error("Invalid report type");
    }

    res.status(200).json({ success: true, message, data: reportData });
  } catch (error) {
    // Catch errors specific to report generation logic
    if (error.statusCode) throw error; // Re-throw if it's a controlled error
    console.error(`Error generating report ${reportType}:`, error);
    res.status(500);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
});

module.exports = {
  getDashboardStats,
  // User Management
  getAllUsers,
  getFullUserDetails,
  suspendUser,
  restoreUser,
  // Book Management
  getAllBooks,
  deleteBook,
  // Transaction Viewing
  getAllTransactions,
  // Dispute Management
  createDispute, // User-facing API for raising disputes
  getAllDisputes, // Admin API
  getDisputeDetails, // Admin API
  resolveDispute, // Admin API
  // Review Moderation
  getAllReviews, // Admin API
  moderateReview, // Admin API
  // System Logs & Reports
  getSystemLogs,
  generateReport,
};
