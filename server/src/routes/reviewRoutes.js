const express = require("express");
const {
  createReview,
  getReviewDetails,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: User reviews and ratings
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review for a completed transaction
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - transactionType
 *               - rating
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b6"
 *                 description: ID of the completed transaction
 *               transactionType:
 *                 type: string
 *                 enum: [ExchangeRequest, SellTransaction, BorrowRequest]
 *                 example: "SellTransaction"
 *                 description: Type of the transaction
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating given (1-5 stars)
 *               comment:
 *                 type: string
 *                 example: "Great buyer, smooth transaction!"
 *                 nullable: true
 *                 description: Optional review comment (max 1000 characters)
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Review created successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input, transaction not completed, or already reviewed
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
 *         description: Forbidden (user not a participant or reviewing self)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Transaction not found
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
router.post("/", protect, createReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get details of a specific review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the review to get
 *     responses:
 *       200:
 *         description: Review details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
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
router.get("/:reviewId", getReviewDetails);

// Note: GET /api/users/:userId/reviews and GET /api/users/me/reviews/given are handled in userRoutes.js
// because they are conceptually tied to the user profile.

module.exports = router;
