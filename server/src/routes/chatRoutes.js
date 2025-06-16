const express = require("express");
const {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  markAllMessagesAsRead,
} = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All chat routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Chat System
 *   description: Real-time messaging between users involved in transactions
 */

/**
 * @swagger
 * /conversations/{transactionType}/{transactionId}:
 *   post:
 *     summary: Create or get an existing conversation for a specific transaction
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionType
 *         schema:
 *           type: string
 *           enum: [ExchangeRequest, SellTransaction, BorrowRequest]
 *         required: true
 *         description: Type of the transaction
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Conversation retrieved or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 *       400:
 *         description: Invalid transaction type
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
 *         description: Forbidden (user is not a participant in the transaction)
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
router.post("/:transactionType/:transactionId", getOrCreateConversation);

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get a list of conversations for the authenticated user
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       participants:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/User' # Populated user objects
 *                       transaction: { type: string } # Transaction ID
 *                       transactionModel: { type: string }
 *                       lastMessageAt: { type: string, format: 'date-time' }
 *                       createdAt: { type: string, format: 'date-time' }
 *                       updatedAt: { type: string, format: 'date-time' }
 *                       lastMessage: # Snippet of the last message
 *                         type: object
 *                         properties:
 *                           _id: { type: string }
 *                           text: { type: string }
 *                           sender: { type: string } # Sender User ID
 *                           createdAt: { type: string, format: 'date-time' }
 *                         nullable: true
 *                       unreadCount: { type: integer, example: 2 } # Number of unread messages for the user
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
router.get("/", getMyConversations);

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   get:
 *     summary: Get messages for a specific conversation
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the conversation
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination (fetches older messages)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 50 }
 *                 total: { type: integer, example: 150 }
 *                 page: { type: integer, example: 1 }
 *                 pages: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
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
 *         description: Conversation not found
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
router.get("/:conversationId/messages", getConversationMessages);

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   post:
 *     summary: Send a new message in a conversation
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Is the book still available?"
 *                 description: The message text (max 1000 characters)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Message sent" }
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input (empty text)
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
 *         description: Conversation not found
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
router.post("/:conversationId/messages", sendMessage);

/**
 * @swagger
 * /messages/{messageId}/read:
 *   put:
 *     summary: Mark a specific message as read
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the message to mark as read
 *     responses:
 *       200:
 *         description: Message marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Message marked as read" }
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (user is not a participant in the conversation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Message not found
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
router.put("/messages/:messageId/read", markMessageAsRead);

/**
 * @swagger
 * /conversations/{conversationId}/read-all:
 *   put:
 *     summary: Mark all messages in a conversation as read for the current user
 *     tags: [Chat System]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the conversation
 *     responses:
 *       200:
 *         description: Messages marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "5 messages marked as read" }
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
 *         description: Conversation not found
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
router.put("/:conversationId/read-all", markAllMessagesAsRead);

module.exports = router;
