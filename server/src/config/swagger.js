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
          },
        },
        // Add other schemas as you implement modules (Book, Transaction, etc.)
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
