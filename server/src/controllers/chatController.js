const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
// const { sendNotification } = require('../utils/notificationService'); // Assuming notification utility
// const { getIo } = require('../socket'); // Assuming Socket.IO setup

// Helper to check if user is a participant in a conversation
const isParticipant = (conversation, userId) => {
  return conversation.participants.some(
    (p) => p.toString() === userId.toString()
  );
};

// @desc    Create or get an existing conversation for a specific transaction
// @route   POST /api/conversations/:transactionType/:transactionId
// @access  Private
const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { transactionType, transactionId } = req.params;
  const userId = req.user._id;

  // Validate transaction type
  const validTransactionTypes = [
    "ExchangeRequest",
    "SellTransaction",
    "BorrowRequest",
  ];
  if (!validTransactionTypes.includes(transactionType)) {
    res.status(400);
    throw new Error("Invalid transaction type");
  }

  // Find the transaction to get participants
  const TransactionModel = mongoose.model(transactionType);
  const transaction = await TransactionModel.findById(transactionId).populate(
    "seller buyer owner borrower"
  ); // Populate relevant fields

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Determine participants based on transaction type
  let participantIds = [];
  if (transactionType === "ExchangeRequest") {
    participantIds = [transaction.requester, transaction.owner].map((id) =>
      id.toString()
    );
  } else if (transactionType === "SellTransaction") {
    participantIds = [transaction.seller, transaction.buyer].map((id) =>
      id.toString()
    );
  } else if (transactionType === "BorrowRequest") {
    participantIds = [transaction.owner, transaction.borrower].map((id) =>
      id.toString()
    );
  }

  // Ensure the authenticated user is one of the participants
  if (!participantIds.includes(userId.toString())) {
    res.status(403);
    throw new Error("Not authorized to access this transaction's chat");
  }

  // Sort participant IDs to ensure consistent lookup order
  participantIds.sort();

  // Find existing conversation
  let conversation = await Conversation.findOne({
    transaction: transactionId,
    transactionModel: transactionType,
    participants: { $all: participantIds }, // Ensure both participants are present
  });

  // If conversation doesn't exist, create it
  if (!conversation) {
    conversation = await Conversation.create({
      transaction: transactionId,
      transactionModel: transactionType,
      participants: participantIds,
    });
  }

  // Populate participants for the response
  conversation = await conversation.populate(
    "participants",
    "name profileImageUrl"
  );

  res.status(200).json({ success: true, data: conversation });
});

// @desc    Get a list of conversations for the authenticated user (with last message snippet)
// @route   GET /api/conversations
// @access  Private
const getMyConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find conversations where the user is a participant
  const conversations = await Conversation.find({ participants: userId })
    .populate("participants", "name profileImageUrl") // Populate participants
    .sort({ lastMessageAt: -1 }); // Sort by most recent message

  // For each conversation, find the last message and count unread messages for the user
  const conversationsWithLastMessage = await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await Message.findOne({ conversation: conv._id })
        .sort({ createdAt: -1 })
        .select("text sender createdAt"); // Select fields for snippet

      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        sender: { $ne: userId }, // Messages not sent by the current user
        readBy: { $nin: [userId] }, // Messages not read by the current user
      });

      // Add last message and unread count to the conversation object
      // Use .toObject() to modify the Mongoose document
      const convObject = conv.toObject();
      convObject.lastMessage = lastMessage;
      convObject.unreadCount = unreadCount;

      return convObject;
    })
  );

  res
    .status(200)
    .json({
      success: true,
      count: conversationsWithLastMessage.length,
      data: conversationsWithLastMessage,
    });
});

// @desc    Get messages for a specific conversation (with pagination)
// @route   GET /api/conversations/:conversationId/messages
// @access  Private
const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;
  const { page = 1, limit = 50 } = req.query; // Pagination for messages

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  // Ensure user is a participant
  if (!isParticipant(conversation, userId)) {
    res.status(403);
    throw new Error("Not authorized to view messages in this conversation");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  // Get messages, sorted by creation date (oldest first for chat history)
  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "name profileImageUrl") // Populate sender info
    .sort({ createdAt: 1 }) // Sort by oldest first
    .skip(skip)
    .limit(limitInt);

  const totalMessages = await Message.countDocuments({
    conversation: conversationId,
  });

  // Mark messages as read by the current user (asynchronously)
  // This can be done after sending the response for better performance
  Message.updateMany(
    {
      conversation: conversationId,
      _id: { $in: messages.map((msg) => msg._id) },
      readBy: { $nin: [userId] },
    },
    { $addToSet: { readBy: userId } } // Use $addToSet to avoid duplicates
  )
    .exec()
    .catch((err) => console.error("Failed to mark messages as read:", err));

  res.status(200).json({
    success: true,
    count: messages.length,
    total: totalMessages,
    page: parseInt(page),
    pages: Math.ceil(totalMessages / limitInt),
    data: messages,
  });
});

// @desc    Send a new message in a conversation
// @route   POST /api/conversations/:conversationId/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const senderId = req.user._id;

  if (!text || text.trim() === "") {
    res.status(400);
    throw new Error("Message text cannot be empty");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  // Ensure user is a participant
  if (!isParticipant(conversation, senderId)) {
    res.status(403);
    throw new Error("Not authorized to send messages in this conversation");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text: text.trim(),
    readBy: [senderId], // Sender has read their own message
  });

  // Update last message timestamp on the conversation
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // Populate sender for the response and potential real-time delivery
  const populatedMessage = await message.populate(
    "sender",
    "name profileImageUrl"
  );

  // TODO: Implement real-time delivery via WebSockets
  // const io = getIo();
  // const otherParticipantId = conversation.participants.find(p => p.toString() !== senderId.toString());
  // io.to(otherParticipantId.toString()).emit('newMessage', populatedMessage); // Emit to the other participant's room/socket ID

  // TODO: Send push notification to the other participant if they are offline
  // await sendNotification(otherParticipantId, 'new_message', `New message from ${req.user.name}`, conversation._id, 'Conversation', { messageId: message._id });

  res
    .status(201)
    .json({ success: true, message: "Message sent", data: populatedMessage });
});

// @desc    Mark a specific message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private
const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId).populate("conversation");

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  // Ensure user is a participant in the conversation
  if (!message.conversation || !isParticipant(message.conversation, userId)) {
    res.status(403);
    throw new Error("Not authorized to mark this message as read");
  }

  // Add user ID to readBy array if not already present
  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId);
    await message.save();
  }

  res.status(200).json({ success: true, message: "Message marked as read" });
});

// @desc    Mark all messages in a conversation as read for the current user
// @route   PUT /api/conversations/:conversationId/read-all
// @access  Private
const markAllMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  // Ensure user is a participant
  if (!isParticipant(conversation, userId)) {
    res.status(403);
    throw new Error("Not authorized to access this conversation");
  }

  // Update all messages in the conversation not sent by the user and not already read by the user
  const updateResult = await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $nin: [userId] },
    },
    {
      $addToSet: { readBy: userId },
    }
  );

  res
    .status(200)
    .json({
      success: true,
      message: `${updateResult.modifiedCount} messages marked as read`,
    });
});

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  markAllMessagesAsRead,
};
