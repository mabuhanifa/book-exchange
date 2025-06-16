const express = require("express");
const {
  getAllReviews,
  moderateReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

// All admin review routes should be protected and require the 'admin' role
router.use(protect, authorize("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin - Reviews
 *   description: Admin management of user reviews
 */

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     summary: Get a list of all reviews (Admin only)
 *     tags: [Admin - Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 100 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review' # Admin might see more details
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user does not have admin role)
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
router.get("/", getAllReviews);

/**
 * @swagger
 * /admin/reviews/{reviewId}/moderate:
 *   put:
 *     summary: Moderate (e.g., hide, edit) a review (Admin only)
 *     tags: [Admin - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the review to moderate
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isModerated:
 *                 type: boolean
 *                 example: true
 *                 description: Set to true to hide/moderate, false to unmoderate
 *               moderationReason:
 *                 type: string
 *                 example: "Contains inappropriate language"
 *                 nullable: true
 *                 description: Reason for moderation
 *     responses:
 *       200:
 *         description: Review moderated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Review moderated successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user does not have admin role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.put("/:reviewId/moderate", moderateReview);

module.exports = router;
