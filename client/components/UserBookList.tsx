import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookCard from "./BookCard";
import ErrorMessage from "./ui/ErrorMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
import Pagination from "./ui/Pagination";

interface Book {
  id: string;
  title: string;
  author: string;
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  image?: string;
  owner?: { name: string; area: string };
  availability: string;
}

interface UserBookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  paginationData?: { currentPage: number; totalPages: number };
  onPageChange?: (page: number) => void;
}

export default function UserBookList({
  books,
  loading,
  error,
  paginationData,
  onPageChange,
}: UserBookListProps) {
  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>My Book Listings</h2>
        <Link href="/books/new">
          <Button>Add New Book</Button>
        </Link>
      </div>
      {books.length === 0 ? (
        <p>You have not listed any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            // UserBookList might show more actions like Edit/Delete directly on the card or list item
            // For now, linking to edit page
            <Link key={book.id} href={`/books/${book.id}/edit`}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      )}
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
