# 8. Reviews and Ratings Module

## Description of Module

This module allows users to review and rate each other after completing a transaction. It aggregates ratings to provide an overall reputation score for users. Admins may have the ability to moderate reviews.

## Required Models (Mongoose schemas)

### `Review` Model

```javascript
// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User writing the review
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User being reviewed
    transaction: {
      // Link to the completed transaction
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExchangeRequest" || "SellTransaction" || "BorrowRequest", // Dynamic ref
      required: true,
      unique: true, // One review per transaction pair
    },
    transactionModel: {
      type: String,
      required: true,
      enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
    }, // To know which model the transaction is
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 star rating
    comment: { type: String, maxlength: 1000 }, // Optional text review
    // Moderation fields
    isModerated: { type: Boolean, default: false },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    moderatedAt: { type: Date },
    moderationReason: { type: String },
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `POST /api/reviews`: Create a new review.
- `GET /api/users/:userId/reviews`: Get reviews received by a specific user.
- `GET /api/users/me/reviews/given`: Get reviews written by the authenticated user.
- `GET /api/reviews/:reviewId`: Get details of a specific review.
- `GET /api/admin/reviews`: Get all reviews (Admin only, with filters for moderation).
- `PUT /api/admin/reviews/:reviewId/moderate`: Moderate (e.g., hide, edit) a review (Admin only).

## Business Logic Notes

- Eligibility: Users can only leave a review for another user after a transaction they were both involved in reaches a 'completed' status. Each user can review the other participant once per completed transaction.
- Rating aggregation: The `averageRating` and `totalReviews` fields on the `User` model should be updated whenever a new review is added or an existing one is moderated. This can be done via Mongoose middleware (post-save) or a separate background job.
- Review visibility: Reviews should be visible on the reviewee's public profile. Moderated reviews might be hidden or flagged.
- Moderation: Admins can review submitted comments and ratings and take action if they violate policies.

## Validation & Security Considerations

- Input validation: Validate rating is between 1 and 5. Validate comment length.
- Authentication: User must be authenticated to leave a review.
- Authorization: Ensure the `reviewer` and `reviewee` were participants in the specified `transaction`. Ensure the `transaction` status is 'completed'. Prevent a user from reviewing the same transaction participant multiple times. Restrict moderation APIs to admins.
- Prevent self-review: A user cannot review themselves.

## Example Edge Cases

- User tries to leave a review for a transaction that is not completed.
- User tries to review someone they were not in a transaction with.
- User tries to leave a second review for the same completed transaction.
- Admin moderates a review, and the user's average rating needs recalculation.
- A transaction is disputed after reviews have been left.

## Database Relationships

- `Review` has a many-to-one relationship with `Reviewer` (`User`).
- `Review` has a many-to-one relationship with `Reviewee` (`User`).
- `Review` has a one-to-one relationship with a transaction model (`ExchangeRequest`, `SellTransaction`, or `BorrowRequest`).
- `Review` has a many-to-one relationship with `ModeratedBy` (`User` - Admin).
