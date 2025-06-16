import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
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
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          {displayUser?.image && (
            <img
              src={displayUser.image}
              alt={displayUser.name}
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
          )}
          {displayUser && (
            <Link href={`/users/${displayUser.id}`}>
              <strong className="text-md">{displayUser.name}</strong>
            </Link>
          )}
        </div>
        {/* Star rating component */}
        <div className="text-sm text-gray-600">Rating: {review.rating}/5</div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{review.comment}</p>
        <Link
          href={`/transactions/details/${review.transactionId}`}
          className="text-xs text-blue-600 mt-2 inline-block"
        >
          View Transaction
        </Link>
      </CardContent>
    </Card>
  );
}
