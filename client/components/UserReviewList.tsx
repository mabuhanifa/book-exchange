import ReviewCard from "./ReviewCard";
// Import Pagination component later

interface Review {
  id: string;
  reviewer?: { id: string; name: string; image?: string };
  reviewee?: { id: string; name: string; image?: string };
  rating: number;
  comment: string;
  transactionId: string;
  // Add other review details
}

interface UserReviewListProps {
  reviews: Review[];
  type: "received" | "given";
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any' with actual pagination type
  onPageChange?: (page: number) => void;
}

export default function UserReviewList({
  reviews,
  type,
  loading,
  error,
  paginationData,
  onPageChange,
}: UserReviewListProps) {
  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;

  return (
    <div>
      <h2>Reviews {type === "received" ? "Received" : "Given"}</h2>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
      {/* Pagination component will go here */}
    </div>
  );
}
