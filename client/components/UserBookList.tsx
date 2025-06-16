import Link from "next/link";
import BookCard from "./BookCard";
// Import Pagination component later

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
  paginationData?: any; // Replace 'any' with actual pagination type
  onPageChange?: (page: number) => void;
}

export default function UserBookList({
  books,
  loading,
  error,
  paginationData,
  onPageChange,
}: UserBookListProps) {
  if (loading) return <div>Loading your books...</div>;
  if (error) return <div>Error loading your books: {error}</div>;

  return (
    <div>
      <h2>My Book Listings</h2>
      <Link href="/books/new">
        {/* Shadcn Button */}
        <button>Add New Book</button>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {books.map((book) => (
          // UserBookList might show more actions like Edit/Delete directly on the card or list item
          // For now, linking to edit page
          <Link key={book.id} href={`/books/${book.id}/edit`}>
            <BookCard book={book} />
          </Link>
        ))}
      </div>
      {/* Pagination component will go here */}
    </div>
  );
}
