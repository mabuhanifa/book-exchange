# 7. Chat System Module

## Description of Module

This module provides real-time or near real-time communication between users involved in a transaction (exchange, buy/sell, borrow). It allows users to discuss details before or during a transaction.

## Required Models (Mongoose schemas)

### `Conversation` Model

```javascript
// Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ], // Array of 2 user IDs
    transaction: {
      // Link to the relevant transaction
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest" || "SellTransaction" || "BorrowRequest", // Dynamic ref based on transactionType
      required: true,
      unique: true, // One conversation per transaction
    },
    transactionModel: {
      type: String,
      required: true,
      enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
    }, // To know which model to populate
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
```

### `Message` Model

```javascript
// Message Schema
const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true, maxlength: 1000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have read this message
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `GET /api/conversations`: Get a list of conversations for the authenticated user (with last message snippet).
- `GET /api/conversations/:conversationId/messages`: Get messages for a specific conversation (with pagination).
- `POST /api/conversations/:conversationId/messages`: Send a new message in a conversation.
- `POST /api/conversations/:transactionType/:transactionId`: Create or get an existing conversation for a specific transaction.
- `PUT /api/messages/:messageId/read`: Mark a specific message as read.
- `PUT /api/conversations/:conversationId/read-all`: Mark all messages in a conversation as read for the current user.

## Business Logic Notes

- Conversation creation: A conversation is automatically created or retrieved the first time two users involved in a specific transaction attempt to chat.
- Access: Only the two participants of a conversation can view its messages or send new ones.
- Real-time: Use WebSockets (Socket.IO) for real-time message sending and receiving. Fallback to polling if WebSockets are not feasible initially.
- Message history: Implement pagination for loading older messages in a conversation.
- Unread count: Track unread messages per user per conversation using the `readBy` array or a separate mechanism. Provide an API to get the total unread count for the user.
- Notifications: Integrate with the Notification module to send push notifications for new messages when the user is offline.

## Validation & Security Considerations

- Authentication: User must be authenticated to access chat features.
- Authorization: Ensure users can only access conversations they are a participant in. Ensure sender of a message is a participant in the conversation.
- Input validation: Validate message text length.
- WebSocket security: Secure WebSocket connections (WSS). Authenticate WebSocket connections using JWT.
- Data privacy: Messages should be private between participants.

## Example Edge Cases

- User tries to access a conversation they are not a part of.
- User tries to send a message in a non-existent conversation.
- High volume of messages in a conversation (pagination is key).
- One user blocks another (not explicitly requested, but a potential feature).
- Transaction status changes (e.g., completed, cancelled) - chat might become read-only or archived.

## Database Relationships

- `Conversation` has a many-to-many relationship with `User` (via the `participants` array).
- `Conversation` has a one-to-one relationship with a transaction model (`ExchangeRequest`, `SellTransaction`, or `BorrowRequest`).
- `Message` has a many-to-one relationship with `Conversation`.
- `Message` has a many-to-one relationship with `Sender` (`User`).
- `Message` has a many-to-many relationship with `User` (via the `readBy` array).
