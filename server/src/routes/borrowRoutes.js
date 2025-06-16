const express = require("express");
const {
  createBorrowRequest,
  getSentBorrowRequests,
  getReceivedBorrowRequests,
  getBorrowRequest,
  acceptBorrowRequest,
  rejectBorrowRequest,
  cancelBorrowRequest,
  markBorrowed,
  confirmBorrowReturn,
} = require("../controllers/borrowController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All borrow request routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Borrow Module
 *   description: Managing book borrowing requests and periods
 */

/**
 * @swagger
 * /borrow-requests:
 *   post:
 *     summary: Create a new borrow request (Borrower initiates)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - requestedDuration
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                 description: ID of the book the authenticated user wants to borrow
 *               requestedDuration:
 *                 type: integer
 *                 example: 7
 *                 description: Requested borrow duration in days (minimum 1)
 *     responses:
 *       201:
 *         description: Borrow request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Borrow request created successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Invalid input, book not available, or existing request
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
 *         description: Forbidden (e.g., borrower owns the book)
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
router.post("/", createBorrowRequest);

/**
 * @swagger
 * /borrow-requests/sent:
 *   get:
 *     summary: Get borrow requests sent by the authenticated user (Borrower)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent borrow requests retrieved successfully
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
 *                     $ref: '#/components/schemas/BorrowRequest'
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
router.get("/sent", getSentBorrowRequests);

/**
 * @swagger
 * /borrow-requests/received:
 *   get:
 *     summary: Get borrow requests received by the authenticated user (Owner)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of received borrow requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BorrowRequest'
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
router.get("/received", getReceivedBorrowRequests);

/**
 * @swagger
 * /borrow-requests/{requestId}:
 *   get:
 *     summary: Get details of a specific borrow request
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to get
 *     responses:
 *       200:
 *         description: Borrow request details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user is not a participant)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.get("/:requestId", getBorrowRequest);

/**
 * @swagger
 * /borrow-requests/{requestId}/accept:
 *   put:
 *     summary: Accept a pending borrow request (Owner only)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to accept
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               acceptedDuration:
 *                 type: integer
 *                 example: 10
 *                 description: Optional. The duration in days the owner accepts (defaults to requestedDuration if not provided).
 *     responses:
 *       200:
 *         description: Borrow request accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Borrow request accepted" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Request not pending, book unavailable, or invalid duration
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
 *         description: Forbidden (user is not the owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.put("/:requestId/accept", acceptBorrowRequest);

/**
 * @swagger
 * /borrow-requests/{requestId}/reject:
 *   put:
 *     summary: Reject a pending borrow request (Owner only)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to reject
 *     responses:
 *       200:
 *         description: Borrow request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Borrow request rejected" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Request not pending
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
 *         description: Forbidden (user is not the owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.put("/:requestId/reject", rejectBorrowRequest);

/**
 * @swagger
 * /borrow-requests/{requestId}/cancel:
 *   put:
 *     summary: Cancel a pending borrow request (Borrower only)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to cancel
 *     responses:
 *       200:
 *         description: Borrow request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Borrow request cancelled" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Request not pending or accepted
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
 *         description: Forbidden (user is not the borrower)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.put("/:requestId/cancel", cancelBorrowRequest);

/**
 * @swagger
 * /borrow-requests/{requestId}/mark-borrowed:
 *   put:
 *     summary: Mark the book as handed over and start the borrow period (Owner only)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to mark as borrowed
 *     responses:
 *       200:
 *         description: Borrow period started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Borrow period started" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Request not accepted yet
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
 *         description: Forbidden (user is not the owner)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.put("/:requestId/mark-borrowed", markBorrowed);

/**
 * @swagger
 * /borrow-requests/{requestId}/confirm-return:
 *   put:
 *     summary: Mark completion of the return process (Both Borrower and Owner)
 *     tags: [Borrow Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the borrow request to confirm return for
 *     responses:
 *       200:
 *         description: Return confirmation received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Return confirmation received" }
 *                 data:
 *                   $ref: '#/components/schemas/BorrowRequest'
 *       400:
 *         description: Request not active or overdue
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
 *         description: Forbidden (user is not a participant)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Borrow request not found
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
router.put("/:requestId/confirm-return", confirmBorrowReturn);

module.exports = router;
