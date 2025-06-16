"use client";

import React, { useState } from "react";
// Import Shadcn Form, Textarea, Button later
// Import Star rating input component later

interface Transaction {
  id: string;
  // Add relevant transaction details
}

interface User {
  id: string;
  name: string;
  // Add relevant user details
}

interface ReviewFormData {
  rating: number;
  comment: string;
  transactionId: string;
  revieweeId: string;
}

interface ReviewFormProps {
  transaction: Transaction;
  reviewee: User;
  onSubmit: (data: ReviewFormData) => void;
  loading: boolean;
  error: string | null;
}

export default function ReviewForm({
  transaction,
  reviewee,
  onSubmit,
  loading,
  error,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating.");
      return;
    }
    onSubmit({
      rating,
      comment,
      transactionId: transaction.id,
      revieweeId: reviewee.id,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Leave a Review for {reviewee.name}</h2>
      <div>
        <label>Rating</label>
        {/* Star rating input component */}
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment">Comment</label>
        {/* Shadcn Textarea */}
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {/* Shadcn Button */}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
