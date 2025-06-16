import BookCard from "./BookCard";
// Import Pagination, Filter/Sort components later

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

interface BookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any' with actual pagination type
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: any) => void; // Replace 'any'
  onSortChange?: (sort: any) => void; // Replace 'any'
}

export default function BookList({
  books,
  loading,
  error,
  paginationData,
  onPageChange,
  onFilterChange,
  onSortChange,
}: BookListProps) {
  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books: {error}</div>;

  return (
    <div>
      {/* Filter/Sort components will go here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      {/* Pagination component will go here */}
    </div>
  );
}
