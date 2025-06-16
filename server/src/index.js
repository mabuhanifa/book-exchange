require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const { protect } = require("./middlewares/authMiddleware");
const { authorize } = require("./middlewares/roleMiddleware");

// Import auth routes
const authRoutes = require("./routes/authRoutes");

// Import Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// TODO: Add other middlewares like logging, security headers (helmet), CORS if needed
// app.use(helmet());
// app.use(cors());

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Exit process if DB connection fails
    process.exit(1);
  });

// Basic Route
app.get("/", (req, res) => {
  res.send("Dhaka Local Book Exchange Marketplace Backend is running!");
});

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount API routes
app.use("/api/auth", authRoutes); // Mount authentication routes

// TODO: Mount other API routes here later, e.g.:
// app.use('/api/users', protect, require('./routes/userRoutes')); // Example of protected route
// app.use('/api/admin', protect, authorize('admin'), require('./routes/adminRoutes')); // Example of admin-only route
// ... etc.

// Error Handling Middleware (should be the last middleware)
app.use(errorHandler);

// Start the server (only if not in a serverless environment like Vercel)
// Vercel handles starting the server by exporting the app instance
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;
