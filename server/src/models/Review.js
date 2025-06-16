const mongoose = require("mongoose");

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
      required: true,
      unique: true, // One review per transaction pair (reviewer -> reviewee for this transaction)
    },
    transactionModel: {
      type: String,
      required: true,
      enum: ["ExchangeRequest", "SellTransaction", "BorrowRequest"],
    }, // To know which model the transaction is
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1-5 star rating
    comment: { type: String, maxlength: 1000 }, // Optional text review
    isModerated: { type: Boolean, default: false },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user ID
    moderatedAt: { type: Date },
    moderationReason: { type: String },
  },
  { timestamps: true }
);

// Ensure a user can only review another user once per transaction
reviewSchema.index({ reviewer: 1, transaction: 1 }, { unique: true });

// Post-save hook to update user's average rating (basic implementation)
reviewSchema.post("save", async function (doc, next) {
  // Avoid updating if review is being moderated or deleted
  if (doc.isModerated || this._action === "delete") {
    // _action is a custom property set before remove/delete
    return next();
  }

  try {
    const reviews = await this.model("Review").find({
      reviewee: doc.reviewee,
      isModerated: false,
    });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await this.model("User").findByIdAndUpdate(doc.reviewee, {
      averageRating: averageRating,
      totalReviews: reviews.length,
    });
    next();
  } catch (error) {
    console.error("Error updating user rating:", error);
    // Decide how to handle errors here - maybe log and continue, or pass to next(error)
    next(error); // Pass error to Mongoose error handling
  }
});

// Pre-remove hook to update user's average rating before deletion
reviewSchema.pre("remove", async function (next) {
  this._action = "delete"; // Custom flag for post-save hook
  next();
});
// For Mongoose v7+, use pre('deleteOne') or pre('deleteMany')

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
