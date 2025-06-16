const SellTransaction = require("../models/SellTransaction");
const Book = require("../models/Book");
const asyncHandler = require("express-async-handler");
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility

// @desc    Create a new sell transaction (Buyer initiates)
// @route   POST /api/sell-transactions
// @access  Private
const createSellTransaction = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const buyerId = req.user._id;

  if (!bookId) {
    res.status(400);
    throw new Error("Please provide the bookId");
  }

  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Validate book type, ownership, and availability
  if (book.transactionType !== "sell") {
    res.status(400);
    throw new Error("This book is not listed for sale");
  }
  if (book.owner.toString() === buyerId.toString()) {
    res.status(400);
    throw new Error("Cannot buy your own book");
  }
  if (!book.isAvailable) {
    res.status(400);
    throw new Error("This book is not available for sale");
  }

  // Check if a pending transaction already exists for this book
  const existingTransaction = await SellTransaction.findOne({
    book: bookId,
    status: "pending",
  });

  if (existingTransaction) {
    res.status(400);
    throw new Error("A pending transaction already exists for this book");
  }

  const sellTransaction = await SellTransaction.create({
    seller: book.owner,
    buyer: buyerId,
    book: bookId,
    price: book.expectedPrice, // Capture price at the time of transaction
    status: "pending",
    paymentStatus: "pending", // Default for COD
  });

  // Optional: Mark book as pending/unavailable immediately upon transaction initiation
  // book.isAvailable = false;
  // book.status = 'pending'; // Or a specific 'pending_sale' status
  // await book.save();

  // TODO: Send notification to the seller
  // await sendNotification(book.owner, 'sell_transaction_initiated', `New sale request for "${book.title}"`, sellTransaction._id, 'SellTransaction');

  res
    .status(201)
    .json({
      success: true,
      message: "Sell transaction initiated successfully",
      data: sellTransaction,
    });
});

// @desc    Get sell transactions initiated by the authenticated user (Buyer)
// @route   GET /api/sell-transactions/buying
// @access  Private
const getBuyingTransactions = asyncHandler(async (req, res) => {
  const transactions = await SellTransaction.find({ buyer: req.user._id })
    .populate("book", "title images")
    .populate("seller", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: transactions.length, data: transactions });
});

// @desc    Get sell transactions where the authenticated user is the seller
// @route   GET /api/sell-transactions/selling
// @access  Private
const getSellingTransactions = asyncHandler(async (req, res) => {
  const transactions = await SellTransaction.find({ seller: req.user._id })
    .populate("book", "title images")
    .populate("buyer", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: transactions.length, data: transactions });
});

// @desc    Get details of a specific sell transaction
// @route   GET /api/sell-transactions/:transactionId
// @access  Private
const getSellTransaction = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId)
    .populate("seller", "name area")
    .populate("buyer", "name area")
    .populate("book", "title author images");

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is a participant
  if (
    transaction.seller.toString() !== req.user._id.toString() &&
    transaction.buyer.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this transaction");
  }

  res.status(200).json({ success: true, data: transaction });
});

// @desc    Accept a pending sell transaction (Seller only)
// @route   PUT /api/sell-transactions/:transactionId/accept
// @access  Private
const acceptSellTransaction = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is the seller
  if (transaction.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to accept this transaction");
  }

  // Ensure transaction is pending
  if (transaction.status !== "pending") {
    res.status(400);
    throw new Error(
      `Cannot accept transaction with status "${transaction.status}"`
    );
  }

  // Check if book is still available (important if not marked unavailable on initiation)
  const book = await Book.findById(transaction.book);
  if (!book || !book.isAvailable) {
    transaction.status = "cancelled"; // Auto-cancel if book unavailable
    await transaction.save();
    // TODO: Notify buyer about cancellation due to unavailability
    res.status(400);
    throw new Error("The book is no longer available. Transaction cancelled.");
  }

  transaction.status = "accepted";
  await transaction.save();

  // Mark book as unavailable
  book.isAvailable = false;
  // Optional: Update book status to 'pending_sale' or similar
  // book.status = 'pending_sale';
  await book.save();

  // TODO: Cancel any other pending transactions/requests involving this book
  // TODO: Send notification to the buyer
  // await sendNotification(transaction.buyer, 'sell_transaction_status_changed', `Your sale request for "${book.title}" was accepted.`, transaction._id, 'SellTransaction');

  res
    .status(200)
    .json({
      success: true,
      message: "Sell transaction accepted",
      data: transaction,
    });
});

// @desc    Reject a pending sell transaction (Seller only)
// @route   PUT /api/sell-transactions/:transactionId/reject
// @access  Private
const rejectSellTransaction = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is the seller
  if (transaction.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to reject this transaction");
  }

  // Ensure transaction is pending
  if (transaction.status !== "pending") {
    res.status(400);
    throw new Error(
      `Cannot reject transaction with status "${transaction.status}"`
    );
  }

  transaction.status = "rejected";
  await transaction.save();

  // Make book available again if it was marked pending
  const book = await Book.findById(transaction.book);
  if (book) {
    book.isAvailable = true;
    book.status = "active";
    await book.save();
  }

  // TODO: Send notification to the buyer
  // await sendNotification(transaction.buyer, 'sell_transaction_status_changed', `Your sale request for "${book.title}" was rejected.`, transaction._id, 'SellTransaction');

  res
    .status(200)
    .json({
      success: true,
      message: "Sell transaction rejected",
      data: transaction,
    });
});

// @desc    Cancel a pending sell transaction (Buyer or Seller)
// @route   PUT /api/sell-transactions/:transactionId/cancel
// @access  Private
const cancelSellTransaction = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId);
  const userId = req.user._id;

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is a participant
  if (
    transaction.seller.toString() !== userId.toString() &&
    transaction.buyer.toString() !== userId.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to cancel this transaction");
  }

  // Only allow cancellation if status is pending or accepted (before completion confirmed)
  if (transaction.status !== "pending" && transaction.status !== "accepted") {
    res.status(400);
    throw new Error(
      `Cannot cancel transaction with status "${transaction.status}"`
    );
  }

  transaction.status = "cancelled";
  await transaction.save();

  // Make book available again if it was marked unavailable
  const book = await Book.findById(transaction.book);
  if (book) {
    book.isAvailable = true;
    book.status = "active";
    await book.save();
  }

  // TODO: Send notification to the other party
  // const otherUserId = transaction.seller.toString() === userId.toString() ? transaction.buyer : transaction.seller;
  // await sendNotification(otherUserId, 'sell_transaction_status_changed', `A sale transaction for "${book.title}" was cancelled.`, transaction._id, 'SellTransaction');

  res
    .status(200)
    .json({
      success: true,
      message: "Sell transaction cancelled",
      data: transaction,
    });
});

// @desc    Mark payment status (Seller only, for COD)
// @route   PUT /api/sell-transactions/:transactionId/mark-paid
// @access  Private
const markSellTransactionPaid = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId);

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is the seller
  if (transaction.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error(
      "Not authorized to mark payment status for this transaction"
    );
  }

  // Only allow marking paid if transaction is accepted and payment is pending
  if (
    transaction.status !== "accepted" ||
    transaction.paymentStatus !== "pending"
  ) {
    res.status(400);
    throw new Error(
      `Cannot mark payment for transaction with status "${transaction.status}" and payment status "${transaction.paymentStatus}"`
    );
  }

  transaction.paymentStatus = "paid";
  await transaction.save();

  // TODO: Send notification to the buyer that payment is confirmed
  // await sendNotification(transaction.buyer, 'sell_transaction_payment_status_changed', `Payment confirmed for "${(await Book.findById(transaction.book)).title}".`, transaction._id, 'SellTransaction');

  res
    .status(200)
    .json({
      success: true,
      message: "Payment marked as paid",
      data: transaction,
    });
});

// @desc    Mark completion of the transaction (Both Buyer and Seller)
// @route   PUT /api/sell-transactions/:transactionId/confirm-completion
// @access  Private
const confirmSellCompletion = asyncHandler(async (req, res) => {
  const transaction = await SellTransaction.findById(req.params.transactionId);
  const userId = req.user._id;

  if (!transaction) {
    res.status(404);
    throw new Error("Sell transaction not found");
  }

  // Ensure user is a participant and transaction is accepted and paid
  if (
    transaction.seller.toString() !== userId.toString() &&
    transaction.buyer.toString() !== userId.toString()
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to confirm completion for this transaction"
    );
  }
  if (transaction.status !== "accepted") {
    res.status(400);
    throw new Error(
      `Cannot confirm completion for transaction with status "${transaction.status}"`
    );
  }
  if (transaction.paymentStatus !== "paid") {
    res.status(400);
    throw new Error(
      "Cannot confirm completion until payment is marked as paid"
    );
  }

  // Mark confirmation based on user role
  if (transaction.buyer.toString() === userId.toString()) {
    transaction.buyerConfirmedCompletion = true;
  } else if (transaction.seller.toString() === userId.toString()) {
    transaction.sellerConfirmedCompletion = true;
  }

  // Check if both parties have confirmed
  if (
    transaction.buyerConfirmedCompletion &&
    transaction.sellerConfirmedCompletion
  ) {
    transaction.status = "completed";

    // Mark book as completed (no longer available)
    const book = await Book.findById(transaction.book);
    if (book) {
      book.isAvailable = false;
      book.status = "completed";
      await book.save();
    }

    // TODO: Trigger eligibility for reviews for both users
    // TODO: Send notification to both parties that transaction is completed
  } else {
    // TODO: Notify the other party that one user has confirmed completion
  }

  await transaction.save();

  res
    .status(200)
    .json({
      success: true,
      message: "Completion confirmed",
      data: transaction,
    });
});

module.exports = {
  createSellTransaction,
  getBuyingTransactions,
  getSellingTransactions,
  getSellTransaction,
  acceptSellTransaction,
  rejectSellTransaction,
  cancelSellTransaction,
  markSellTransactionPaid,
  confirmSellCompletion,
};
