// Custom Error Handling Middleware

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack to console

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    error: message,
    // Optionally include more details in development
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
