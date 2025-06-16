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
        // Define reusable schemas here (e.g., ErrorResponse)
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
        // Add other schemas as you implement modules (SellTransaction, BorrowRequest, Chat, etc.)
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
