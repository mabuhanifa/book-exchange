const express = require("express");
const {
  createExchangeRequest,
  getSentExchangeRequests,
  getReceivedExchangeRequests,
  getExchangeRequest,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
  confirmExchangeCompletion,
} = require("../controllers/exchangeController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All exchange routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Exchange Transactions
 *   description: Managing book exchange requests and transactions
 */

/**
 * @swagger
 * /exchange-requests:
 *   post:
 *     summary: Create a new exchange request
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requesterBookId
 *               - ownerBookId
 *             properties:
 *               requesterBookId:
 *                 type: string
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                 description: ID of the book the authenticated user is offering
 *               ownerBookId:
 *                 type: string
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b5"
 *                 description: ID of the book the authenticated user wants to receive
 *               message:
 *                 type: string
 *                 example: "Hi, I'm interested in exchanging my book for yours."
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Exchange request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Exchange request created successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
 *       400:
 *         description: Invalid input, books not available, or existing request
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
 *         description: Forbidden (e.g., requester doesn't own the book)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: One or both books not found
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
router.post("/", createExchangeRequest);

/**
 * @swagger
 * /exchange-requests/sent:
 *   get:
 *     summary: Get exchange requests sent by the authenticated user
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent exchange requests retrieved successfully
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
 *                     $ref: '#/components/schemas/ExchangeRequest'
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
router.get("/sent", getSentExchangeRequests);

/**
 * @swagger
 * /exchange-requests/received:
 *   get:
 *     summary: Get exchange requests received by the authenticated user
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of received exchange requests retrieved successfully
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
 *                     $ref: '#/components/schemas/ExchangeRequest'
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
router.get("/received", getReceivedExchangeRequests);

/**
 * @swagger
 * /exchange-requests/{requestId}:
 *   get:
 *     summary: Get details of a specific exchange request
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the exchange request to get
 *     responses:
 *       200:
 *         description: Exchange request details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
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
 *         description: Exchange request not found
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
router.get("/:requestId", getExchangeRequest);

/**
 * @swagger
 * /exchange-requests/{requestId}/accept:
 *   put:
 *     summary: Accept a pending exchange request (Owner only)
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the exchange request to accept
 *     responses:
 *       200:
 *         description: Exchange request accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Exchange request accepted" }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
 *       400:
 *         description: Request not pending or books unavailable
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
 *         description: Exchange request not found
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
router.put("/:requestId/accept", acceptExchangeRequest);

/**
 * @swagger
 * /exchange-requests/{requestId}/reject:
 *   put:
 *     summary: Reject a pending exchange request (Owner only)
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the exchange request to reject
 *     responses:
 *       200:
 *         description: Exchange request rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Exchange request rejected" }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
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
 *         description: Exchange request not found
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
router.put("/:requestId/reject", rejectExchangeRequest);

/**
 * @swagger
 * /exchange-requests/{requestId}/cancel:
 *   put:
 *     summary: Cancel a pending exchange request (Requester only)
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the exchange request to cancel
 *     responses:
 *       200:
 *         description: Exchange request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Exchange request cancelled" }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
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
 *         description: Forbidden (user is not the requester)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exchange request not found
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
router.put("/:requestId/cancel", cancelExchangeRequest);

/**
 * @swagger
 * /exchange-requests/{requestId}/confirm-completion:
 *   put:
 *     summary: Mark completion of the exchange (Both Requester and Owner)
 *     tags: [Exchange Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the exchange request to confirm completion for
 *     responses:
 *       200:
 *         description: Completion confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Completion confirmed" }
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRequest'
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
 *         description: Forbidden (user is not a participant)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exchange request not found
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
router.put("/:requestId/confirm-completion", confirmExchangeCompletion);

module.exports = router;
