const BorrowRequest = require("../models/BorrowRequest");
const Book = require("../models/Book");
const asyncHandler = require("express-async-handler");
const { addDays } = require("date-fns"); // Helper for date calculations
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility
// const { scheduleOverdueCheck } = require('../utils/scheduler'); // Assuming a scheduler utility

// @desc    Create a new borrow request (Borrower initiates)
// @route   POST /api/borrow-requests
// @access  Private
const createBorrowRequest = asyncHandler(async (req, res) => {
  const { bookId, requestedDuration } = req.body;
  const borrowerId = req.user._id;

  if (!bookId || !requestedDuration || requestedDuration < 1) {
    res.status(400);
    throw new Error(
      "Please provide bookId and a valid requestedDuration (in days)"
    );
  }

  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Validate book type, ownership, and availability
  if (book.transactionType !== "borrow") {
    res.status(400);
    throw new Error("This book is not listed for borrowing");
  }
  if (book.owner.toString() === borrowerId.toString()) {
    res.status(400);
    throw new Error("Cannot borrow your own book");
  }
  if (!book.isAvailable) {
    res.status(400);
    throw new Error("This book is not available for borrowing");
  }

  // Check if a pending request already exists for this book by this borrower
  const existingRequest = await BorrowRequest.findOne({
    book: bookId,
    borrower: borrowerId,
    status: "pending",
  });

  if (existingRequest) {
    res.status(400);
    throw new Error(
      "A pending borrow request already exists for this book from you"
    );
  }

  const borrowRequest = await BorrowRequest.create({
    borrower: borrowerId,
    owner: book.owner,
    book: bookId,
    requestedDuration: parseInt(requestedDuration),
    status: "pending",
  });

  // Optional: Mark book as pending/unavailable immediately upon request initiation
  // book.isAvailable = false;
  // book.status = 'pending'; // Or a specific 'pending_borrow' status
  // await book.save();

  // TODO: Send notification to the owner
  // await sendNotification(book.owner, 'borrow_request_received', `New borrow request for "${book.title}"`, borrowRequest._id, 'BorrowRequest');

  res
    .status(201)
    .json({
      success: true,
      message: "Borrow request created successfully",
      data: borrowRequest,
    });
});

// @desc    Get borrow requests sent by the authenticated user (Borrower)
// @route   GET /api/borrow-requests/sent
// @access  Private
const getSentBorrowRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({ borrower: req.user._id })
    .populate("book", "title images")
    .populate("owner", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: requests.length, data: requests });
});

// @desc    Get borrow requests received by the authenticated user (Owner)
// @route   GET /api/borrow-requests/received
// @access  Private
const getReceivedBorrowRequests = asyncHandler(async (req, res) => {
  const requests = await BorrowRequest.find({ owner: req.user._id })
    .populate("book", "title images")
    .populate("borrower", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: requests.length, data: requests });
});

// @desc    Get details of a specific borrow request
// @route   GET /api/borrow-requests/:requestId
// @access  Private
const getBorrowRequest = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId)
    .populate("borrower", "name area")
    .populate("owner", "name area")
    .populate("book", "title author images");

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is a participant
  if (
    request.borrower.toString() !== req.user._id.toString() &&
    request.owner.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this request");
  }

  res.status(200).json({ success: true, data: request });
});

// @desc    Accept a pending borrow request (Owner only)
// @route   PUT /api/borrow-requests/:requestId/accept
// @access  Private
const acceptBorrowRequest = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId);
  const { acceptedDuration } = req.body; // Owner can propose a different duration

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is the owner
  if (request.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to accept this request");
  }

  // Ensure request is pending
  if (request.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot accept request with status "${request.status}"`);
  }

  // Check if book is still available (important if not marked unavailable on initiation)
  const book = await Book.findById(request.book);
  if (!book || !book.isAvailable) {
    request.status = "cancelled"; // Auto-cancel if book unavailable
    await request.save();
    // TODO: Notify borrower about cancellation due to unavailability
    res.status(400);
    throw new Error("The book is no longer available. Request cancelled.");
  }

  // Update duration if owner specified one, otherwise use requested
  if (acceptedDuration !== undefined && acceptedDuration >= 1) {
    request.requestedDuration = parseInt(acceptedDuration); // Store the accepted duration in the requestedDuration field
  } else if (
    request.requestedDuration === undefined ||
    request.requestedDuration < 1
  ) {
    // Should not happen if validation on create is correct, but as a fallback
    res.status(400);
    throw new Error("Accepted duration must be a positive number");
  }

  request.status = "accepted";
  await request.save();

  // Mark book as unavailable
  book.isAvailable = false;
  // Optional: Update book status to 'pending_borrow' or similar
  // book.status = 'pending_borrow';
  await book.save();

  // TODO: Cancel any other pending requests involving this book
  // TODO: Send notification to the borrower
  // await sendNotification(request.borrower, 'borrow_request_status_changed', `Your borrow request for "${book.title}" was accepted.`, request._id, 'BorrowRequest');

  res
    .status(200)
    .json({ success: true, message: "Borrow request accepted", data: request });
});

// @desc    Reject a pending borrow request (Owner only)
// @route   PUT /api/borrow-requests/:requestId/reject
// @access  Private
const rejectBorrowRequest = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is the owner
  if (request.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to reject this request");
  }

  // Ensure request is pending
  if (request.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot reject request with status "${request.status}"`);
  }

  request.status = "rejected";
  await request.save();

  // Make book available again if it was marked pending
  const book = await Book.findById(request.book);
  if (book) {
    book.isAvailable = true;
    book.status = "active";
    await book.save();
  }

  // TODO: Send notification to the borrower
  // await sendNotification(request.borrower, 'borrow_request_status_changed', `Your borrow request for "${book.title}" was rejected.`, request._id, 'BorrowRequest');

  res
    .status(200)
    .json({ success: true, message: "Borrow request rejected", data: request });
});

// @desc    Cancel a pending borrow request (Borrower only)
// @route   PUT /api/borrow-requests/:requestId/cancel
// @access  Private
const cancelBorrowRequest = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId);
  const userId = req.user._id;

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is the borrower
  if (request.borrower.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this request");
  }

  // Only allow cancellation if status is pending or accepted (before marked active)
  if (request.status !== "pending" && request.status !== "accepted") {
    res.status(400);
    throw new Error(`Cannot cancel request with status "${request.status}"`);
  }

  request.status = "cancelled";
  await request.save();

  // Make book available again if it was marked unavailable
  const book = await Book.findById(request.book);
  if (book) {
    book.isAvailable = true;
    book.status = "active";
    await book.save();
  }

  // TODO: Send notification to the owner
  // await sendNotification(request.owner, 'borrow_request_status_changed', `A borrow request for "${book.title}" was cancelled by the borrower.`, request._id, 'BorrowRequest');

  res
    .status(200)
    .json({
      success: true,
      message: "Borrow request cancelled",
      data: request,
    });
});

// @desc    Mark the book as handed over and start the borrow period (Owner only)
// @route   PUT /api/borrow-requests/:requestId/mark-borrowed
// @access  Private
const markBorrowed = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is the owner
  if (request.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to mark this request as borrowed");
  }

  // Ensure request is accepted
  if (request.status !== "accepted") {
    res.status(400);
    throw new Error(
      `Cannot mark as borrowed request with status "${request.status}"`
    );
  }

  // Set borrowDate and calculate dueDate
  const borrowDate = new Date();
  const dueDate = addDays(borrowDate, request.requestedDuration); // Use the accepted duration

  request.status = "active";
  request.borrowDate = borrowDate;
  request.dueDate = dueDate;
  await request.save();

  // Book should already be marked unavailable from 'accepted' state

  // TODO: Schedule an overdue check/notification for the dueDate
  // await scheduleOverdueCheck(request._id, dueDate);

  // TODO: Send notification to the borrower
  // await sendNotification(request.borrower, 'borrow_request_status_changed', `Your borrow request for "${(await Book.findById(request.book)).title}" is now active. Due date: ${dueDate.toDateString()}`, request._id, 'BorrowRequest');

  res
    .status(200)
    .json({ success: true, message: "Borrow period started", data: request });
});

// @desc    Mark completion of the return process (Both Borrower and Owner)
// @route   PUT /api/borrow-requests/:requestId/confirm-return
// @access  Private
const confirmBorrowReturn = asyncHandler(async (req, res) => {
  const request = await BorrowRequest.findById(req.params.requestId);
  const userId = req.user._id;

  if (!request) {
    res.status(404);
    throw new Error("Borrow request not found");
  }

  // Ensure user is a participant and request is active or overdue
  if (
    request.borrower.toString() !== userId.toString() &&
    request.owner.toString() !== userId.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to confirm return for this request");
  }
  if (request.status !== "active" && request.status !== "overdue") {
    res.status(400);
    throw new Error(
      `Cannot confirm return for request with status "${request.status}"`
    );
  }

  // Mark confirmation based on user role
  if (request.borrower.toString() === userId.toString()) {
    request.borrowerConfirmedReturn = true;
  } else if (request.owner.toString() === userId.toString()) {
    request.ownerConfirmedReturn = true;
    request.returnDate = new Date(); // Owner marks the actual return date
  }

  // Check if both parties have confirmed
  if (request.borrowerConfirmedReturn && request.ownerConfirmedReturn) {
    request.status = "returned";

    // Mark book as available again
    const book = await Book.findById(request.book);
    if (book) {
      book.isAvailable = true;
      book.status = "active"; // Or 'returned' if tracking completed status on book
      await book.save();
    }

    // TODO: Trigger eligibility for reviews for both users
    // TODO: Cancel any pending overdue checks for this request
    // TODO: Send notification to both parties that return is completed
  } else {
    // TODO: Notify the other party that one user has confirmed return
  }

  await request.save();

  res
    .status(200)
    .json({
      success: true,
      message: "Return confirmation received",
      data: request,
    });
});

// TODO: Add a scheduled job function here or in a separate file
// This job would run periodically, find requests with status 'active'
// where dueDate is in the past, and update their status to 'overdue'.
// It would also trigger notifications.

module.exports = {
  createBorrowRequest,
  getSentBorrowRequests,
  getReceivedBorrowRequests,
  getBorrowRequest,
  acceptBorrowRequest,
  rejectBorrowRequest,
  cancelBorrowRequest,
  markBorrowed,
  confirmBorrowReturn,
};
