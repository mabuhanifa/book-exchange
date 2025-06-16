# 2. User Profiles Module

## Description of Module

This module manages user profile information, including personal details, contact information, selected area, and profile image. It also includes logic for admin-based user suspension.

## Required Models (Mongoose schemas)

### `User` Model (Full Schema)

```javascript
// User Schema
const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true, index: true },
    otp: { type: String }, // Hashed OTP
    otpExpires: { type: Date },
    password: { type: String }, // Optional
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Optional, unique if provided
    area: { type: String, required: true, index: true }, // e.g., 'Dhanmondi', 'Gulshan'
    profileImageUrl: { type: String }, // URL to stored image
    bio: { type: String, maxlength: 500 },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: { type: String },
    suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    suspendedAt: { type: Date },
    // Aggregated fields (optional, could be computed or updated via triggers/jobs)
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `GET /api/users/:userId`: Get a specific user's public profile.
- `GET /api/users/me`: Get the authenticated user's own profile.
- `PUT /api/users/me`: Update the authenticated user's profile.
- `POST /api/users/me/profile-image`: Upload/update profile image.
- `GET /api/admin/users`: Get a list of all users (Admin only).
- `PUT /api/admin/users/:userId/suspend`: Suspend a user (Admin only).
- `PUT /api/admin/users/:userId/restore`: Restore a user (Admin only).

## Business Logic Notes

- Area selection: Users must select one of the predefined Dhaka areas during or after registration. This area is crucial for book filtering and search.
- Profile visibility: Some fields (like phone number, email) might only be visible to the user themselves or transaction partners. Public profile should show name, area, rating, bio, profile image.
- Profile image: Implement file upload logic (e.g., using Multer) and store images in a cloud storage service (S3, Cloudinary) or locally, storing the URL in the database.
- Suspension: Admins can suspend users, preventing them from posting books, initiating transactions, or chatting. Suspended users might still be able to view content depending on requirements.

## Validation & Security Considerations

- Input validation: Validate name, email format, area (against a predefined list), bio length.
- Authentication: Ensure only the authenticated user can update their own profile (`/me` endpoints).
- Authorization: Implement middleware to restrict admin endpoints (`/admin/users`) to users with the 'admin' role.
- Data privacy: Be mindful of which profile fields are publicly accessible vs. private.
- Image upload security: Validate file types and sizes. Sanitize filenames. Protect against malicious file uploads.

## Example Edge Cases

- User tries to update profile with invalid data (e.g., non-existent area).
- User tries to upload a non-image file or a very large file.
- A suspended user attempts to perform actions requiring an active account.
- Admin tries to suspend a user that is already suspended.

## Database Relationships

- `User` model is central and related to many other models (Books, Transactions, Chats, Reviews, Notifications) via the `_id` field.
- `suspendedBy` field in `User` links to another `User` (the admin who performed the action).
