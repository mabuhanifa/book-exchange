# 1. Authentication Module

## Description of Module

This module handles user registration, login, OTP verification, and JWT token management for secure access to the application. It supports phone number-based authentication and defines user roles.

## Required Models (Mongoose schemas)

### `User` Model (Partial - Authentication related fields)

```javascript
// User Schema Snippet (Authentication)
const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    otp: { type: String }, // Hashed OTP
    otpExpires: { type: Date },
    password: { type: String }, // Optional, if password login is added later
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    // ... other user profile fields in 2_user_profiles.md
  },
  { timestamps: true }
);
```

### `RefreshToken` Model

```javascript
// Refresh Token Schema
const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Auto-delete after 7 days
});
```

## Required APIs (express routes)

- `POST /api/auth/register`: Initiate registration (send OTP).
- `POST /api/auth/verify-otp`: Verify OTP and complete registration/login.
- `POST /api/auth/login`: Initiate login (send OTP).
- `POST /api/auth/refresh-token`: Get a new access token using a refresh token.
- `POST /api/auth/logout`: Invalidate refresh token.
- `POST /api/auth/resend-otp`: Resend OTP.

## Business Logic Notes

- OTP generation: Generate a random, fixed-length numeric code.
- OTP expiry: Set a short expiry time (e.g., 2-5 minutes).
- OTP storage: Store hashed OTP in the User model temporarily.
- JWT Access Token: Short expiry (e.g., 15-30 minutes). Used for API authorization.
- JWT Refresh Token: Longer expiry (e.g., 7 days). Used to obtain new access tokens without re-authenticating.
- Token invalidation: Refresh tokens should be invalidated on logout or if compromised.
- User status: A user is considered fully registered/logged in only after OTP verification.

## Validation & Security Considerations

- Input validation: Validate phone number format.
- OTP security: Hash OTP before storing. Use a secure random generator. Rate limit OTP requests (registration, login, resend).
- JWT security: Use strong secrets for signing tokens. Store secrets securely. Use HTTPS.
- Refresh Token security: Store refresh tokens securely (e.g., in an HttpOnly cookie or secure storage). Associate refresh tokens with specific users. Implement token rotation or single-use refresh tokens for higher security.
- Rate limiting: Implement rate limiting on login, registration, and OTP verification endpoints to prevent brute-force attacks.
- Role-based access: Implement middleware to check user roles for accessing specific routes.

## Example Edge Cases

- User requests OTP multiple times rapidly.
- OTP expires before verification.
- User tries to verify OTP for a different phone number.
- Invalid or expired refresh token used.
- Concurrent login attempts from different devices.

## Database Relationships

- `User` has a one-to-many relationship with `RefreshToken` (one user can have multiple active refresh tokens, e.g., from different devices).
