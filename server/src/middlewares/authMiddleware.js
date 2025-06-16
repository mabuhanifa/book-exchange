// Placeholder for JWT Authentication Middleware
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming User model path

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from token payload (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res
          .status(401)
          .json({ success: false, error: "Not authorized, user not found" });
        return; // Stop execution
      }

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: "Not authorized, no token" });
  }
};

module.exports = { protect };
