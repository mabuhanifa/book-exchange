const express = require("express");
const {
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
  getAllDisputes,
  getDisputeDetails,
  resolveDispute,
  // Review Moderation
  getAllReviews,
  moderateReview,
  // System Logs & Reports
  getSystemLogs,
  generateReport,
  // Note: createDispute is a user-facing API, not included here
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const router = express.Router();

// All routes in this router require authentication and admin role
router.use(protect, authorize("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin - Dashboard
 *   description: Aggregate system statistics for admin dashboard
 *   x-displayName: Dashboard
 *
 * tags:
 *   name: Admin - Users
 *   description: Admin management of user accounts
 *   x-displayName: Users
 *
 * tags:
 *   name: Admin - Books
 *   description: Admin management of book listings
 *   x-displayName: Books
 *
 * tags:
 *   name: Admin - Transactions
 *   description: Admin viewing of all transaction types
 *   x-displayName: Transactions
 *
 * tags:
 *   name: Admin - Disputes
 *   description: Admin management and resolution of disputes
 *   x-displayName: Disputes
 *
 * tags:
 *   name: Admin - Reviews
 *   description: Admin moderation of user reviews
 *   x-displayName: Reviews
 *
 * tags:
 *   name: Admin - System
 *   description: Admin access to system logs and reports
 *   x-displayName: System
 */

// --- Dashboard ---
/**
 * @swagger
 * /admin/dashboard-stats:
 *   get:
 *     summary: Get aggregate system statistics (Admin only)
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: integer, example: 500 }
 *                     activeListings: { type: integer, example: 250 }
 *                     pendingTransactions:
 *                       type: object
 *                       properties:
 *                         exchange: { type: integer, example: 10 }
 *                         sell: { type: integer, example: 15 }
 *                         borrow: { type: integer, example: 8 }
 *                     openDisputes: { type: integer, example: 3 }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/dashboard-stats", getDashboardStats);

// --- User Management ---
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get a list of all users (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
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
 *                     $ref: '#/components/schemas/User' # Admin might see more fields than public
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/users/{userId}:
 *   get:
 *     summary: Get full details of a specific user (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the user to get full details for
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User' # Admin sees full details
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/users/:userId", getFullUserDetails);

/**
 * @swagger
 * /admin/users/{userId}/suspend:
 *   put:
 *     summary: Suspend a user (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the user to suspend
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Violated community guidelines"
 *     responses:
 *       200:
 *         description: User suspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User 017... suspended" }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.put("/users/:userId/suspend", suspendUser);

/**
 * @swagger
 * /admin/users/{userId}/restore:
 *   put:
 *     summary: Restore a suspended user (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the user to restore
 *     responses:
 *       200:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User 017... restored" }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.put("/users/:userId/restore", restoreUser);

// --- Book Management ---
/**
 * @swagger
 * /admin/books:
 *   get:
 *     summary: Get a list of all book listings (Admin only)
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 250 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book' # Admin might see more details
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/books", getAllBooks);

/**
 * @swagger
 * /admin/books/{bookId}:
 *   delete:
 *     summary: Delete a book listing (Admin only)
 *     tags: [Admin - Books]
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
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.delete("/books/:bookId", deleteBook);

// --- Transaction Viewing ---
/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get a list of all transactions (Admin only)
 *     tags: [Admin - Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 500 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object # Represents a combined transaction object
 *                     properties:
 *                       type: { type: string, example: "SellTransaction" }
 *                       # Add properties from ExchangeRequest, SellTransaction, BorrowRequest schemas
 *                       # This schema is simplified as the actual response combines multiple types
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/transactions", getAllTransactions);

// --- Dispute Management ---
/**
 * @swagger
 * /admin/disputes:
 *   get:
 *     summary: Get a list of all disputes (Admin only)
 *     tags: [Admin - Disputes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all disputes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 10 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dispute'
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/disputes", getAllDisputes);

/**
 * @swagger
 * /admin/disputes/{disputeId}:
 *   get:
 *     summary: Get details of a specific dispute (Admin only)
 *     tags: [Admin - Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the dispute to get details for
 *     responses:
 *       200:
 *         description: Dispute details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Dispute'
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/disputes/:disputeId", getDisputeDetails);

/**
 * @swagger
 * /admin/disputes/{disputeId}/resolve:
 *   put:
 *     summary: Resolve a dispute (Admin only)
 *     tags: [Admin - Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the dispute to resolve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resolution
 *               - status
 *             properties:
 *               resolution:
 *                 type: string
 *                 example: "Both parties agreed to cancel the transaction."
 *                 description: Admin's notes on the resolution
 *               status:
 *                 type: string
 *                 enum: [resolved, closed]
 *                 example: "resolved"
 *                 description: The final status of the dispute
 *     responses:
 *       200:
 *         description: Dispute resolved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Dispute resolved successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/Dispute'
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.put("/disputes/:disputeId/resolve", resolveDispute);

// --- Review Moderation ---
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
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.get("/reviews", getAllReviews);

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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isModerated
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
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       404: { $ref: '#/components/responses/NotFoundError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 */
router.put("/reviews/:reviewId/moderate", moderateReview);

// --- System Logs & Reports ---
/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Get system logs (Admin only)
 *     tags: [Admin - System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       501:
 *         description: Not Implemented
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "System logs endpoint not yet implemented" }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 */
router.get("/logs", getSystemLogs);

/**
 * @swagger
 * /admin/reports/{reportType}:
 *   get:
 *     summary: Generate basic reports (Admin only)
 *     tags: [Admin - System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [user-growth, transactions-by-area] # Add other report types here
 *         required: true
 *         description: Type of report to generate
 *     responses:
 *       200:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User growth report generated" }
 *                 data:
 *                   type: array # Schema depends on report type
 *                   items:
 *                     type: object
 *       400: { $ref: '#/components/responses/BadRequestError' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *       500: { $ref: '#/components/responses/InternalServerError' }
 *       501:
 *         description: Not Implemented (for specific report types)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Transactions by area report not yet implemented" }
 */
router.get("/reports/:reportType", generateReport);

module.exports = router;
