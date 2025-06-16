import { Button } from "@/components/ui/button";
import Link from "next/link";
import ErrorMessage from "../ui/ErrorMessage";
import FilterSortControls from "../ui/FilterSortControls";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
// Import Shadcn Table components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  paginationData?: { currentPage: number; totalPages: number };
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
  // Dummy filter/sort options for FilterSortControls
  const availableFilters = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
    // Add filter by rating, reviewer/reviewee, etc.
  ];
  const availableSorts = [
    { key: "createdAt", label: "Created At" },
    { key: "rating", label: "Rating" },
  ];
  const currentFilters = {}; // Replace with actual state
  const currentSort = null; // Replace with actual state

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>Admin Review Moderation</h1>
      {/* Filter/Sort/Search components */}
      <FilterSortControls
        availableFilters={availableFilters}
        availableSorts={availableSorts}
        currentFilters={currentFilters}
        currentSort={currentSort}
        onFilterChange={onFilter || (() => {})}
        onSortChange={onSort || (() => {})}
        onSearch={onSearch}
      />

      {/* Shadcn Table */}
      <Table>
        <TableCaption>A list of reviews for moderation.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Reviewee</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id.substring(0, 8)}...</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${review.reviewer.id}`}>
                    {review.reviewer.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/users/${review.reviewee.id}`}>
                    {review.reviewee.name}
                  </Link>
                </TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell>{review.comment.substring(0, 50)}...</TableCell>
                <TableCell>
                  <Link href={`/transactions/details/${review.transactionId}`}>
                    {review.transactionId.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{review.status}</TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {review.status === "pending" && onModerate && (
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onModerate(review.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onModerate(review.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {/* Link to view full review details if needed */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {paginationData && onPageChange && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
