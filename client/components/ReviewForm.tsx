"use client";

import React, { useState } from "react";
import ErrorMessage from "./ui/ErrorMessage";
// Import Shadcn Form components
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// Import Star rating input component later
// Import react-hook-form and zod later

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
      alert("Please provide a rating."); // Replace with better UI feedback
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
    // Wrap with Shadcn Form component later
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <ErrorMessage error={error} />
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
