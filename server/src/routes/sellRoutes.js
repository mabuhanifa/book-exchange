const express = require("express");
const {
  createSellTransaction,
  getBuyingTransactions,
  getSellingTransactions,
  getSellTransaction,
  acceptSellTransaction,
  rejectSellTransaction,
  cancelSellTransaction,
  markSellTransactionPaid,
  confirmSellCompletion,
} = require("../controllers/sellController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All sell transaction routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Buy/Sell Transactions
 *   description: Managing book buying and selling transactions
 */

/**
 * @swagger
 * /sell-transactions:
 *   post:
 *     summary: Create a new sell transaction (Buyer initiates)
 *     tags: [Buy/Sell Transactions]
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
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "60f7b3b3b3b3b3b3b3b3b3b4"
 *                 description: ID of the book the authenticated user wants to buy
 *     responses:
 *       201:
 *         description: Sell transaction initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Sell transaction initiated successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Invalid input, book not available, or existing transaction
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
router.post("/", createSellTransaction);

/**
 * @swagger
 * /sell-transactions/buying:
 *   get:
 *     summary: Get sell transactions initiated by the authenticated user (Buyer)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buying transactions retrieved successfully
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
 *                     $ref: '#/components/schemas/SellTransaction'
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
router.get("/buying", getBuyingTransactions);

/**
 * @swagger
 * /sell-transactions/selling:
 *   get:
 *     summary: Get sell transactions where the authenticated user is the seller
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of selling transactions retrieved successfully
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
 *                     $ref: '#/components/schemas/SellTransaction'
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
router.get("/selling", getSellingTransactions);

/**
 * @swagger
 * /sell-transactions/{transactionId}:
 *   get:
 *     summary: Get details of a specific sell transaction
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to get
 *     responses:
 *       200:
 *         description: Sell transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
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
 *         description: Sell transaction not found
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
router.get("/:transactionId", getSellTransaction);

/**
 * @swagger
 * /sell-transactions/{transactionId}/accept:
 *   put:
 *     summary: Accept a pending sell transaction (Seller only)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to accept
 *     responses:
 *       200:
 *         description: Sell transaction accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Sell transaction accepted" }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Transaction not pending or book unavailable
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
 *         description: Forbidden (user is not the seller)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sell transaction not found
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
router.put("/:transactionId/accept", acceptSellTransaction);

/**
 * @swagger
 * /sell-transactions/{transactionId}/reject:
 *   put:
 *     summary: Reject a pending sell transaction (Seller only)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to reject
 *     responses:
 *       200:
 *         description: Sell transaction rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Sell transaction rejected" }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Transaction not pending
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
 *         description: Forbidden (user is not the seller)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sell transaction not found
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
router.put("/:transactionId/reject", rejectSellTransaction);

/**
 * @swagger
 * /sell-transactions/{transactionId}/cancel:
 *   put:
 *     summary: Cancel a pending or accepted sell transaction (Buyer or Seller)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to cancel
 *     responses:
 *       200:
 *         description: Sell transaction cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Sell transaction cancelled" }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Transaction status does not allow cancellation
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
 *         description: Sell transaction not found
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
router.put("/:transactionId/cancel", cancelSellTransaction);

/**
 * @swagger
 * /sell-transactions/{transactionId}/mark-paid:
 *   put:
 *     summary: Mark payment status as paid (Seller only, for COD)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to mark as paid
 *     responses:
 *       200:
 *         description: Payment marked as paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Payment marked as paid" }
 *                 data:
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Transaction status or payment status does not allow marking paid
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
 *         description: Forbidden (user is not the seller)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sell transaction not found
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
router.put("/:transactionId/mark-paid", markSellTransactionPaid);

/**
 * @swagger
 * /sell-transactions/{transactionId}/confirm-completion:
 *   put:
 *     summary: Mark completion of the transaction (Both Buyer and Seller)
 *     tags: [Buy/Sell Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the sell transaction to confirm completion for
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
 *                   $ref: '#/components/schemas/SellTransaction'
 *       400:
 *         description: Transaction not accepted or payment not marked paid
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
 *         description: Sell transaction not found
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
router.put("/:transactionId/confirm-completion", confirmSellCompletion);

module.exports = router;
