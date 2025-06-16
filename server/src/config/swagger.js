const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dhaka Local Book Exchange Marketplace API",
      version: "1.0.0",
      description:
        "API documentation for the Book Exchange Marketplace backend.",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // Local server URL
        description: "Development server",
      },
      {
        url: "https://your-vercel-app-name.vercel.app/api", // Replace with your Vercel app URL
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Error message",
            },
          },
        },
        User: {
          // Basic User schema for responses
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b3" },
            phoneNumber: { type: "string", example: "01712345678" },
            isVerified: { type: "boolean", example: true },
            role: { type: "string", example: "user" },
            name: { type: "string", example: "John Doe", nullable: true },
            area: { type: "string", example: "Dhanmondi", nullable: true },
            profileImageUrl: {
              type: "string",
              example: "http://example.com/image.jpg",
              nullable: true,
            },
            averageRating: { type: "number", example: 4.5 },
            totalReviews: { type: "integer", example: 10 },
            // Admin might see more fields like isSuspended, etc.
          },
        },
        Book: {
          // Book schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b4" },
            owner: {
              type: "object", // Or string if not populated
              $ref: "#/components/schemas/User", // Reference User schema if populated
            },
            title: { type: "string", example: "The Hobbit" },
            author: { type: "string", example: "J.R.R. Tolkien" },
            edition: { type: "string", example: "Paperback" },
            condition: {
              type: "string",
              enum: ["New", "Like New", "Very Good", "Good", "Acceptable"],
              example: "Good",
            },
            description: {
              type: "string",
              example: "A classic fantasy adventure.",
            },
            transactionType: {
              type: "string",
              enum: ["exchange", "sell", "borrow"],
              example: "sell",
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: ["http://example.com/book1.jpg"],
            },
            expectedPrice: { type: "number", example: 350, nullable: true },
            expectedExchangeBook: {
              type: "string",
              example: "Any fantasy novel",
              nullable: true,
            },
            borrowDuration: { type: "integer", example: 14, nullable: true },
            isAvailable: { type: "boolean", example: true },
            area: { type: "string", example: "Mirpur" },
            status: {
              type: "string",
              enum: ["active", "pending", "completed", "cancelled"],
              example: "active",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ExchangeRequest: {
          // ExchangeRequest schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b6" },
            requester: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the requester",
            }, // Could be populated User object
            requesterBook: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b4",
              description: "Book ID offered by requester",
            }, // Could be populated Book object
            owner: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b7",
              description: "User ID of the owner",
            }, // Could be populated User object
            ownerBook: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b5",
              description: "Book ID requested from owner",
            }, // Could be populated Book object
            status: {
              type: "string",
              enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "completed",
              ],
              example: "pending",
            },
            message: {
              type: "string",
              example: "Interested in exchanging!",
              nullable: true,
            },
            requesterConfirmedCompletion: { type: "boolean", example: false },
            ownerConfirmedCompletion: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SellTransaction: {
          // SellTransaction schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b8" },
            seller: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b7",
              description: "User ID of the seller",
            }, // Could be populated User object
            buyer: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the buyer",
            }, // Could be populated User object
            book: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b4",
              description: "Book ID being sold",
            }, // Could be populated Book object
            price: { type: "number", example: 350 },
            status: {
              type: "string",
              enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "completed",
              ],
              example: "pending",
            },
            paymentStatus: {
              type: "string",
              enum: ["pending", "paid", "failed"],
              example: "pending",
            },
            sellerConfirmedCompletion: { type: "boolean", example: false },
            buyerConfirmedCompletion: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BorrowRequest: {
          // BorrowRequest schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b9" },
            borrower: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the borrower",
            }, // Could be populated User object
            owner: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b7",
              description: "User ID of the owner",
            }, // Could be populated User object
            book: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b5",
              description: "Book ID being borrowed",
            }, // Could be populated Book object
            requestedDuration: {
              type: "integer",
              example: 7,
              description: "Duration in days requested/accepted",
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "active",
                "overdue",
                "returned",
                "disputed",
              ],
              example: "pending",
            },
            borrowDate: { type: "string", format: "date-time", nullable: true },
            dueDate: { type: "string", format: "date-time", nullable: true },
            returnDate: { type: "string", format: "date-time", nullable: true },
            borrowerConfirmedReturn: { type: "boolean", example: false },
            ownerConfirmedReturn: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Conversation: {
          // Conversation schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3ba" },
            participants: {
              type: "array",
              items: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b3" }, // Array of User IDs
              description: "Array of participant User IDs",
            }, // Could be populated User objects in response
            transaction: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b6",
              description: "ID of the related transaction",
            },
            transactionModel: {
              type: "string",
              enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
              example: "ExchangeRequest",
            },
            lastMessageAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          // Message schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3bb" },
            conversation: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3ba",
              description: "ID of the parent conversation",
            },
            sender: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the sender",
            }, // Could be populated User object
            text: { type: "string", example: "Hello!" },
            readBy: {
              type: "array",
              items: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b3" }, // Array of User IDs
              description: "Array of User IDs who have read this message",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          // Review schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3bc" },
            reviewer: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the reviewer",
            }, // Could be populated User object
            reviewee: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b7",
              description: "User ID being reviewed",
            }, // Could be populated User object
            transaction: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b8",
              description: "ID of the related transaction",
            },
            transactionModel: {
              type: "string",
              enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
              example: "SellTransaction",
            },
            rating: { type: "integer", example: 5 },
            comment: {
              type: "string",
              example: "Great experience!",
              nullable: true,
            },
            isModerated: { type: "boolean", example: false },
            moderatedBy: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3bd",
              nullable: true,
              description: "Admin User ID who moderated",
            },
            moderatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            moderationReason: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          // Notification schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3be" },
            recipient: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID of the recipient",
            }, // Could be populated User object
            type: {
              type: "string",
              enum: [
                "new_message",
                "exchange_request_received",
                "exchange_request_status_changed",
                "sell_transaction_initiated",
                "sell_transaction_status_changed",
                "sell_transaction_payment_status_changed",
                "borrow_request_received",
                "borrow_request_status_changed",
                "new_review",
                "admin_message",
              ],
              example: "new_message",
            },
            entityType: {
              type: "string",
              enum: [
                "Message",
                "ExchangeRequest",
                "SellTransaction",
                "BorrowRequest",
                "Review",
                "User",
                "System",
              ],
              example: "Message",
              nullable: true,
            },
            entityId: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3bb",
              nullable: true,
              description: "ID of the related entity",
            },
            message: {
              type: "string",
              example: "You have a new message from John Doe.",
            },
            isRead: { type: "boolean", example: false },
            data: {
              type: "object",
              description: "Optional additional data",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Dispute: {
          // Dispute schema
          type: "object",
          properties: {
            _id: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3bf" },
            transaction: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b6",
              description: "ID of the disputed transaction",
            },
            transactionModel: {
              type: "string",
              enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
              example: "ExchangeRequest",
            },
            raisedBy: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3b3",
              description: "User ID who raised the dispute",
            }, // Could be populated User object
            participants: {
              type: "array",
              items: { type: "string", example: "60f7b3b3b3b3b3b3b3b3b3b3" }, // Array of User IDs
              description: "Array of participant User IDs",
            }, // Could be populated User objects
            reason: {
              type: "string",
              example: "Book condition not as described.",
            },
            status: {
              type: "string",
              enum: ["open", "in_progress", "resolved", "closed"],
              example: "open",
            },
            resolution: {
              type: "string",
              example: "Admin ruled in favor of the buyer.",
              nullable: true,
            },
            resolvedBy: {
              type: "string",
              example: "60f7b3b3b3b3b3b3b3b3b3bd",
              nullable: true,
              description: "Admin User ID who resolved",
            },
            resolvedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      responses: {
        // Define reusable responses
        UnauthorizedError: {
          description: "Authentication token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ForbiddenError: {
          description:
            "User does not have the necessary permissions (e.g., not an admin)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        BadRequestError: {
          description: "Invalid request payload or parameters",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Something went wrong on the server",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply bearerAuth globally by default, override on specific routes if needed
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
