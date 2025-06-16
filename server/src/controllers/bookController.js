const Book = require("../models/Book");
const User = require("../models/User"); // Needed to get user's area
const asyncHandler = require("express-async-handler");
// const upload = require('../middlewares/uploadMiddleware'); // Assuming Multer or similar for file uploads
// const { uploadImages, deleteImages } = require('../utils/imageUpload'); // Assuming image upload utility

// @desc    Create a new book listing
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    edition,
    condition,
    description,
    transactionType,
    expectedPrice,
    expectedExchangeBook,
    borrowDuration,
    // images // Images will come from req.files or req.file
  } = req.body;

  // Basic validation
  if (!title || !condition || !transactionType) {
    res.status(400);
    throw new Error("Please provide title, condition, and transaction type");
  }

  // Validate conditional fields based on transactionType
  if (
    transactionType === "sell" &&
    (expectedPrice === undefined || expectedPrice === null)
  ) {
    res.status(400);
    throw new Error("Expected price is required for sell listings");
  }
  if (transactionType === "exchange" && !expectedExchangeBook) {
    res.status(400);
    throw new Error("Expected exchange book is required for exchange listings");
  }
  if (
    transactionType === "borrow" &&
    (borrowDuration === undefined || borrowDuration === null)
  ) {
    res.status(400);
    throw new Error("Borrow duration is required for borrow listings");
  }

  // Get user's area from their profile
  const user = await User.findById(req.user._id);
  if (!user || !user.area) {
    res.status(400);
    throw new Error("User profile incomplete. Please set your area.");
  }
  const area = user.area;

  // TODO: Handle image uploads
  // const imageUrls = req.files ? await uploadImages(req.files) : []; // Assuming multiple files

  const book = await Book.create({
    owner: req.user._id,
    title,
    author,
    edition,
    condition,
    description,
    transactionType,
    expectedPrice: transactionType === "sell" ? expectedPrice : undefined,
    expectedExchangeBook:
      transactionType === "exchange" ? expectedExchangeBook : undefined,
    borrowDuration: transactionType === "borrow" ? borrowDuration : undefined,
    images: [], // Placeholder for image URLs
    area,
    isAvailable: true, // New listings are available
    status: "active",
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Book listing created successfully",
      data: book,
    });
});

// @desc    Get a list of all active book listings (with filters, search, pagination)
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const {
    keyword, // Search term
    transactionType,
    condition,
    area, // Filter by area (defaults to user's area if authenticated?)
    minPrice, // For sell listings
    maxPrice, // For sell listings
    minDuration, // For borrow listings
    maxDuration, // For borrow listings
    sortBy, // e.g., 'createdAt', 'price'
    sortOrder, // 'asc' or 'desc'
    page = 1,
    limit = 10,
  } = req.query;

  const query = {
    isAvailable: true, // Only show available books by default
    status: "active", // Only show active listings
  };

  // Filtering
  if (transactionType) query.transactionType = transactionType;
  if (condition) query.condition = condition;
  if (area) query.area = area; // Filter by specified area

  // Search (basic text search)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ];
  }

  // Price filtering for sell listings
  if (query.transactionType === "sell") {
    if (minPrice !== undefined)
      query.expectedPrice = {
        ...query.expectedPrice,
        $gte: parseFloat(minPrice),
      };
    if (maxPrice !== undefined)
      query.expectedPrice = {
        ...query.expectedPrice,
        $lte: parseFloat(maxPrice),
      };
  } else if (minPrice !== undefined || maxPrice !== undefined) {
    // Ignore price filters if not a sell listing
    delete query.expectedPrice;
  }

  // Duration filtering for borrow listings
  if (query.transactionType === "borrow") {
    if (minDuration !== undefined)
      query.borrowDuration = {
        ...query.borrowDuration,
        $gte: parseInt(minDuration),
      };
    if (maxDuration !== undefined)
      query.borrowDuration = {
        ...query.borrowDuration,
        $lte: parseInt(maxDuration),
      };
  } else if (minDuration !== undefined || maxDuration !== undefined) {
    // Ignore duration filters if not a borrow listing
    delete query.borrowDuration;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  // Sorting
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default sort by newest
  }

  const books = await Book.find(query)
    .populate("owner", "name area averageRating totalReviews") // Populate owner with selected fields
    .sort(sort)
    .skip(skip)
    .limit(limitInt);

  const totalBooks = await Book.countDocuments(query);

  res.status(200).json({
    success: true,
    count: books.length,
    total: totalBooks,
    page: parseInt(page),
    pages: Math.ceil(totalBooks / limitInt),
    data: books,
  });
});

// @desc    Get details of a specific book listing
// @route   GET /api/books/:bookId
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId).populate(
    "owner",
    "name area averageRating totalReviews"
  );

  if (book && book.status === "active") {
    // Only allow viewing active listings publicly? Or allow viewing details of completed/pending?
    res.status(200).json({ success: true, data: book });
  } else {
    res.status(404);
    throw new Error("Book not found or not active");
  }
});

// @desc    Update a specific book listing (Owner only)
// @route   PUT /api/books/:bookId
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Check ownership
  if (book.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this book");
  }

  // Prevent update if book is involved in a pending/active transaction
  if (book.status !== "active") {
    res.status(400);
    throw new Error(
      `Cannot update book with status "${book.status}". Cancel or complete the transaction first.`
    );
  }

  // Update allowed fields
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  book.edition = req.body.edition || book.edition;
  book.condition = req.body.condition || book.condition;
  book.description = req.body.description || book.description;
  // transactionType should probably not be changed after creation
  // book.transactionType = req.body.transactionType || book.transactionType;

  // Update conditional fields based on current transactionType
  if (book.transactionType === "sell") {
    book.expectedPrice =
      req.body.expectedPrice !== undefined
        ? req.body.expectedPrice
        : book.expectedPrice;
  } else if (book.transactionType === "exchange") {
    book.expectedExchangeBook =
      req.body.expectedExchangeBook || book.expectedExchangeBook;
  } else if (book.transactionType === "borrow") {
    book.borrowDuration =
      req.body.borrowDuration !== undefined
        ? req.body.borrowDuration
        : book.borrowDuration;
  }

  // TODO: Handle image updates/deletions

  const updatedBook = await book.save();

  res
    .status(200)
    .json({
      success: true,
      message: "Book listing updated successfully",
      data: updatedBook,
    });
});

// @desc    Delete a specific book listing (Owner only)
// @route   DELETE /api/books/:bookId
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  // Check ownership
  if (book.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this book");
  }

  // Prevent deletion if book is involved in a pending/active transaction
  if (book.status !== "active") {
    res.status(400);
    throw new Error(
      `Cannot delete book with status "${book.status}". Cancel or complete the transaction first.`
    );
  }

  // TODO: Handle image deletion from storage

  await book.remove(); // Mongoose v6+, use deleteOne() or deleteMany() in v7+

  res
    .status(200)
    .json({ success: true, message: "Book listing removed successfully" });
});

// @desc    Get listings created by the authenticated user
// @route   GET /api/users/me/books
// @access  Private
const getMyBooks = asyncHandler(async (req, res) => {
  // TODO: Implement filtering, searching, pagination for user's own books
  const books = await Book.find({ owner: req.user._id }).sort({
    createdAt: -1,
  }); // Sort by newest first

  res.status(200).json({ success: true, count: books.length, data: books });
});

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
};
