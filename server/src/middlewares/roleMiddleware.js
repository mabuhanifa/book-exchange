// Placeholder for Role-Based Access Control Middleware

const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user should be populated by the protect middleware
    if (!req.user || !roles.includes(req.user.role)) {
      res
        .status(403)
        .json({
          success: false,
          error: `User role ${
            req.user ? req.user.role : "unknown"
          } is not authorized to access this route`,
        });
      return; // Stop execution
    }
    next();
  };
};

module.exports = { authorize };
