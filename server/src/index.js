require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const { protect } = require("./middlewares/authMiddleware");
const { authorize } = require("./middlewares/roleMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const bookRoutes = require("./routes/bookRoutes"); // Import book routes
const exchangeRoutes = require("./routes/exchangeRoutes");
const sellRoutes = require("./routes/sellRoutes"); // Import sell routes
const borrowRoutes = require("./routes/borrowRoutes"); // Import borrow routes
const chatRoutes = require("./routes/chatRoutes"); // Import chat routes

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/users", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/exchange-requests", protect, exchangeRoutes);
app.use("/api/sell-transactions", protect, sellRoutes);
app.use("/api/borrow-requests", protect, borrowRoutes);
app.use("/api/conversations", protect, chatRoutes); // Mount chat routes, protected

// TODO: Mount other API routes here later, e.g.:
// app.use('/api/reviews', protect, require('./routes/reviewRoutes'));
// app.use('/api/notifications', protect, require('./routes/notificationRoutes'));
// app.use('/api/admin/books', protect, authorize('admin'), require('./routes/adminBookRoutes'));
// app.use('/api/admin/disputes', protect, authorize('admin'), require('./routes/adminDisputeRoutes'));

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
