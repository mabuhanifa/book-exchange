import Link from "next/link";
// Import Shadcn Table, Pagination, Filter/Sort/Search components later
// Import Shadcn Button later

interface Review {
  id: string;
  reviewer: { id: string; name: string };
  reviewee: { id: string; name: string };
  rating: number;
  comment: string;
  transactionId: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected"; // Moderation status
  // Add other relevant review fields
}

interface AdminReviewListProps {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any'
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onModerate?: (reviewId: string, status: "approved" | "rejected") => void;
}

export default function AdminReviewList({
  reviews,
  loading,
  error,
  paginationData,
  onFilter,
  onSort,
  onSearch,
  onPageChange,
  onModerate,
}: AdminReviewListProps) {
  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;

  return (
    <div>
      <h1>Admin Review Moderation</h1>
      {/* Filter/Sort/Search components */}
      {/* Shadcn Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reviewer</th>
            <th>Reviewee</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Transaction</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>
                <Link href={`/admin/users/${review.reviewer.id}`}>
                  {review.reviewer.name}
                </Link>
              </td>
              <td>
                <Link href={`/admin/users/${review.reviewee.id}`}>
                  {review.reviewee.name}
                </Link>
              </td>
              <td>{review.rating}/5</td>
              <td>{review.comment.substring(0, 50)}...</td>
              <td>
                <Link href={`/transactions/details/${review.transactionId}`}>
                  {review.transactionId}
                </Link>
              </td>
              <td>{review.status}</td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td>
                {review.status === "pending" && onModerate && (
                  <>
                    {/* Shadcn Button */}
                    <button onClick={() => onModerate(review.id, "approved")}>
                      Approve
                    </button>
                    {/* Shadcn Button */}
                    <button onClick={() => onModerate(review.id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
                {/* Link to view full review details if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}
