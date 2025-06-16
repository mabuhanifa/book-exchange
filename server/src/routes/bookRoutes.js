const express = require("express");
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  getMyBooks,
} = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");
// const upload = require('../middlewares/uploadMiddleware'); // Assuming Multer or similar for file uploads

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book listings management and retrieval
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book listing
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - condition
 *               - transactionType
 *             properties:
 *               title: { type: string, example: "The Lord of the Rings" }
 *               author: { type: string, example: "J.R.R. Tolkien" }
 *               edition: { type: string, example: "Paperback" }
 *               condition:
 *                 type: string
 *                 enum: ["New", "Like New", "Very Good", "Good", "Acceptable"]
 *                 example: "Very Good"
 *               description: { type: string, example: "A classic fantasy novel." }
 *               transactionType:
 *                 type: string
 *                 enum: ["exchange", "sell", "borrow"]
 *                 example: "sell"
 *               expectedPrice:
 *                 type: number
 *                 format: float
 *                 example: 500 # Required if transactionType is 'sell'
 *               expectedExchangeBook:
 *                 type: string
 *                 example: "Any fantasy book" # Required if transactionType is 'exchange'
 *               borrowDuration:
 *                 type: integer
 *                 example: 7 # Required if transactionType is 'borrow' (in days)
 *               # images: # Images handled via separate upload or multipart form
 *               #   type: array
 *               #   items:
 *               #     type: string
 *               #     format: binary
 *     responses:
 *       201:
 *         description: Book listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Book listing created successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input or user profile incomplete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// router.post('/', protect, upload.array('images', 5), createBook); // Example with Multer for multiple images
router.post("/", protect, createBook); // Placeholder without Multer

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of all active book listings
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema: { type: string }
 *         description: Search term for title, author, or description
 *       - in: query
 *         name: transactionType
 *         schema: { type: string, enum: ["exchange", "sell", "borrow"] }
 *         description: Filter by transaction type
 *       - in: query
 *         name: condition
 *         schema: { type: string, enum: ["New", "Like New", "Very Good", "Good", "Acceptable"] }
 *         description: Filter by condition
 *       - in: query
 *         name: area
 *         schema: { type: string }
 *         description: Filter by area
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *         description: Minimum price (for sell listings)
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *         description: Maximum price (for sell listings)
 *       - in: query
 *         name: minDuration
 *         schema: { type: integer }
 *         description: Minimum borrow duration (for borrow listings)
 *       - in: query
 *         name: maxDuration
 *         schema: { type: integer }
 *         description: Maximum borrow duration (for borrow listings)
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: ["createdAt", "price", "title"] } # Add other sortable fields
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: ["asc", "desc"] }
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 10 }
 *                 total: { type: integer, example: 100 }
 *                 page: { type: integer, example: 1 }
 *                 pages: { type: integer, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getBooks);

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Get details of a specific book listing
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the book to get
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found or not active
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:bookId", getBook);

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: Update a specific book listing (Owner only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "The Lord of the Rings (Revised)" }
 *               author: { type: string, example: "J.R.R. Tolkien" }
 *               edition: { type: string, example: "Hardcover" }
 *               condition:
 *                 type: string
 *                 enum: ["New", "Like New", "Very Good", "Good", "Acceptable"]
 *                 example: "Like New"
 *               description: { type: string, example: "A classic fantasy novel, revised edition." }
 *               expectedPrice:
 *                 type: number
 *                 format: float
 *                 example: 600 # For sell listings
 *               expectedExchangeBook:
 *                 type: string
 *                 example: "Any high fantasy book" # For exchange listings
 *               borrowDuration:
 *                 type: integer
 *                 example: 10 # For borrow listings (in days)
 *               # images: # Images handled via separate upload or multipart form
 *               #   type: array
 *               #   items:
 *               #     type: string
 *               #     format: binary
 *     responses:
 *       200:
 *         description: Book listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Book listing updated successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input or book is in an active transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user does not own the book)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// router.put('/:bookId', protect, upload.array('images', 5), updateBook); // Example with Multer
router.put("/:bookId", protect, updateBook); // Placeholder without Multer

/**
 * @swagger
 * /books/{bookId}:
 *   delete:
 *     summary: Delete a specific book listing (Owner only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book listing removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Book listing removed successfully" }
 *       400:
 *         description: Book is in an active transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user does not own the book)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:bookId", protect, deleteBook);

/**
 * @swagger
 * /users/me/books:
 *   get:
 *     summary: Get book listings created by the authenticated user
 *     tags: [Users, Books] # Tagged under both Users and Books as per plan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's book listings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 5 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me/books", protect, getMyBooks);

module.exports = router;
