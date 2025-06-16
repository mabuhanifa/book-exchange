const ExchangeRequest = require("../models/ExchangeRequest");
const Book = require("../models/Book");
const asyncHandler = require("express-async-handler");
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility

// @desc    Create a new exchange request
// @route   POST /api/exchange-requests
// @access  Private
const createExchangeRequest = asyncHandler(async (req, res) => {
  const { requesterBookId, ownerBookId, message } = req.body;
  const requesterId = req.user._id;

  if (!requesterBookId || !ownerBookId) {
    res.status(400);
    throw new Error("Please provide both requesterBookId and ownerBookId");
  }

  // Find the books
  const requesterBook = await Book.findById(requesterBookId);
  const ownerBook = await Book.findById(ownerBookId);

  if (!requesterBook || !ownerBook) {
    res.status(404);
    throw new Error("One or both books not found");
  }

  // Validate book ownership and availability
  if (requesterBook.owner.toString() !== requesterId.toString()) {
    res.status(403);
    throw new Error("Requester does not own the book offered");
  }
  if (ownerBook.owner.toString() === requesterId.toString()) {
    res.status(400);
    throw new Error("Cannot exchange a book with yourself");
  }
  if (
    requesterBook.transactionType !== "exchange" ||
    ownerBook.transactionType !== "exchange"
  ) {
    res.status(400);
    throw new Error("Both books must be listed for exchange");
  }
  if (!requesterBook.isAvailable || !ownerBook.isAvailable) {
    res.status(400);
    throw new Error("One or both books are not available for exchange");
  }

  // Check if a pending request already exists between these books/users
  const existingRequest = await ExchangeRequest.findOne({
    $or: [
      {
        requester: requesterId,
        requesterBook: requesterBookId,
        owner: ownerBook.owner,
        ownerBook: ownerBookId,
        status: "pending",
      },
      {
        requester: ownerBook.owner,
        requesterBook: ownerBookId,
        owner: requesterId,
        ownerBook: requesterBookId,
        status: "pending",
      }, // Check reverse direction too
    ],
  });

  if (existingRequest) {
    res.status(400);
    throw new Error(
      "A pending exchange request already exists for these books"
    );
  }

  const exchangeRequest = await ExchangeRequest.create({
    requester: requesterId,
    requesterBook: requesterBookId,
    owner: ownerBook.owner,
    ownerBook: ownerBookId,
    message,
    status: "pending",
  });

  // TODO: Send notification to the owner of the ownerBook
  // await sendNotification(ownerBook.owner, 'exchange_request_received', `New exchange request for "${ownerBook.title}"`, exchangeRequest._id, 'ExchangeRequest');

  res
    .status(201)
    .json({
      success: true,
      message: "Exchange request created successfully",
      data: exchangeRequest,
    });
});

// @desc    Get exchange requests sent by the authenticated user
// @route   GET /api/exchange-requests/sent
// @access  Private
const getSentExchangeRequests = asyncHandler(async (req, res) => {
  const requests = await ExchangeRequest.find({ requester: req.user._id })
    .populate("requesterBook", "title images")
    .populate("ownerBook", "title images")
    .populate("owner", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: requests.length, data: requests });
});

// @desc    Get exchange requests received by the authenticated user
// @route   GET /api/exchange-requests/received
// @access  Private
const getReceivedExchangeRequests = asyncHandler(async (req, res) => {
  const requests = await ExchangeRequest.find({ owner: req.user._id })
    .populate("requesterBook", "title images")
    .populate("ownerBook", "title images")
    .populate("requester", "name area")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, count: requests.length, data: requests });
});

// @desc    Get details of a specific exchange request
// @route   GET /api/exchange-requests/:requestId
// @access  Private
const getExchangeRequest = asyncHandler(async (req, res) => {
  const request = await ExchangeRequest.findById(req.params.requestId)
    .populate("requester", "name area")
    .populate("owner", "name area")
    .populate("requesterBook", "title author images")
    .populate("ownerBook", "title author images");

  if (!request) {
    res.status(404);
    throw new Error("Exchange request not found");
  }

  // Ensure user is a participant
  if (
    request.requester.toString() !== req.user._id.toString() &&
    request.owner.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this request");
  }

  res.status(200).json({ success: true, data: request });
});

// @desc    Accept a pending exchange request (Owner only)
// @route   PUT /api/exchange-requests/:requestId/accept
// @access  Private
const acceptExchangeRequest = asyncHandler(async (req, res) => {
  const request = await ExchangeRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error("Exchange request not found");
  }

  // Ensure user is the owner of the target book
  if (request.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to accept this request");
  }

  // Ensure request is pending
  if (request.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot accept request with status "${request.status}"`);
  }

  // Check if books are still available
  const requesterBook = await Book.findById(request.requesterBook);
  const ownerBook = await Book.findById(request.ownerBook);

  if (
    !requesterBook ||
    !ownerBook ||
    !requesterBook.isAvailable ||
    !ownerBook.isAvailable
  ) {
    request.status = "cancelled"; // Auto-cancel if books unavailable
    await request.save();
    // TODO: Notify requester about cancellation due to unavailability
    res.status(400);
    throw new Error(
      "One or both books are no longer available. Request cancelled."
    );
  }

  request.status = "accepted";
  await request.save();

  // Mark books as unavailable
  requesterBook.isAvailable = false;
  ownerBook.isAvailable = false;
  // Optional: Update book status to 'pending' or similar
  // requesterBook.status = 'pending';
  // ownerBook.status = 'pending';
  await requesterBook.save();
  await ownerBook.save();

  // TODO: Cancel any other pending requests involving these two books
  // TODO: Send notification to the requester
  // await sendNotification(request.requester, 'exchange_request_status_changed', `Your exchange request for "${ownerBook.title}" was accepted.`, request._id, 'ExchangeRequest');

  res
    .status(200)
    .json({
      success: true,
      message: "Exchange request accepted",
      data: request,
    });
});

// @desc    Reject a pending exchange request (Owner only)
// @route   PUT /api/exchange-requests/:requestId/reject
// @access  Private
const rejectExchangeRequest = asyncHandler(async (req, res) => {
  const request = await ExchangeRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error("Exchange request not found");
  }

  // Ensure user is the owner of the target book
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

  // Books remain available (or become available again if they were marked pending)
  // TODO: Send notification to the requester
  // await sendNotification(request.requester, 'exchange_request_status_changed', `Your exchange request for "${(await Book.findById(request.ownerBook)).title}" was rejected.`, request._id, 'ExchangeRequest');

  res
    .status(200)
    .json({
      success: true,
      message: "Exchange request rejected",
      data: request,
    });
});

// @desc    Cancel a pending exchange request (Requester only)
// @route   PUT /api/exchange-requests/:requestId/cancel
// @access  Private
const cancelExchangeRequest = asyncHandler(async (req, res) => {
  const request = await ExchangeRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error("Exchange request not found");
  }

  // Ensure user is the requester
  if (request.requester.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this request");
  }

  // Ensure request is pending
  if (request.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot cancel request with status "${request.status}"`);
  }

  request.status = "cancelled";
  await request.save();

  // Books remain available (or become available again if they were marked pending)
  // TODO: Send notification to the owner
  // await sendNotification(request.owner, 'exchange_request_status_changed', `An exchange request for "${(await Book.findById(request.ownerBook)).title}" was cancelled by the requester.`, request._id, 'ExchangeRequest');

  res
    .status(200)
    .json({
      success: true,
      message: "Exchange request cancelled",
      data: request,
    });
});

// @desc    Mark completion of the exchange (Both Requester and Owner)
// @route   PUT /api/exchange-requests/:requestId/confirm-completion
// @access  Private
const confirmExchangeCompletion = asyncHandler(async (req, res) => {
  const request = await ExchangeRequest.findById(req.params.requestId);
  const userId = req.user._id;

  if (!request) {
    res.status(404);
    throw new Error("Exchange request not found");
  }

  // Ensure user is a participant and request is accepted
  if (
    request.requester.toString() !== userId.toString() &&
    request.owner.toString() !== userId.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to confirm completion for this request");
  }
  if (request.status !== "accepted") {
    res.status(400);
    throw new Error(
      `Cannot confirm completion for request with status "${request.status}"`
    );
  }

  // Mark confirmation based on user role
  if (request.requester.toString() === userId.toString()) {
    request.requesterConfirmedCompletion = true;
  } else if (request.owner.toString() === userId.toString()) {
    request.ownerConfirmedCompletion = true;
  }

  // Check if both parties have confirmed
  if (
    request.requesterConfirmedCompletion &&
    request.ownerConfirmedCompletion
  ) {
    request.status = "completed";

    // Mark books as completed (no longer available)
    const requesterBook = await Book.findById(request.requesterBook);
    const ownerBook = await Book.findById(request.ownerBook);
    if (requesterBook) {
      requesterBook.isAvailable = false;
      requesterBook.status = "completed";
      await requesterBook.save();
    }
    if (ownerBook) {
      ownerBook.isAvailable = false;
      ownerBook.status = "completed";
      await ownerBook.save();
    }

    // TODO: Trigger eligibility for reviews for both users
    // TODO: Send notification to both parties that exchange is completed
  } else {
    // TODO: Notify the other party that one user has confirmed completion
  }

  await request.save();

  res
    .status(200)
    .json({ success: true, message: "Completion confirmed", data: request });
});

module.exports = {
  createExchangeRequest,
  getSentExchangeRequests,
  getReceivedExchangeRequests,
  getExchangeRequest,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
  confirmExchangeCompletion,
};
