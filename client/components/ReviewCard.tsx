import React from 'react';
import Link from 'next/link';
// Import Shadcn Card or other styling components later
// Import Star rating component later

interface Review {
  id: string;
  reviewer?: { id: string; name: string; image?: string };
  reviewee?: { id: string; name: string; image?: string };
  rating: number;
  comment: string;
  transactionId: string;
  // Add other review details
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const displayUser = review.reviewer || review.reviewee; // Display the user who is not the current user

  return (
    {/* Shadcn Card or styled div */}
    <div className="border p-3 rounded-md mb-3">
      <div className="flex items-center mb-2">
        {displayUser?.image && <img src={displayUser.image} alt={displayUser.name} className="w-10 h-10 rounded-full object-cover mr-2" />}
        {displayUser && (
          <Link href={`/users/${displayUser.id}`}>
            <strong>{displayUser.name}</strong>
          </Link>
        )}
      </div>
      {/* Star rating component */}
      <div>Rating: {review.rating}/5</div>
      <p className="mt-2">{review.comment}</p>
      <Link href={`/transactions/details/${review.transactionId}`} className="text-sm text-blue-600 mt-2 inline-block">
        View Transaction
      </Link>
    </div>
  );
}
