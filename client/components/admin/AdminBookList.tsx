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

interface Book {
  id: string;
  title: string;
  author: string;
  type: "exchange" | "sell" | "borrow";
  owner: { id: string; name: string };
  createdAt: string;
  // Add other relevant book fields
}

interface AdminBookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  paginationData?: { currentPage: number; totalPages: number };
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onDelete?: (bookId: string) => void;
}

export default function AdminBookList({
  books,
  loading,
  error,
  paginationData,
  onFilter,
  onSort,
  onSearch,
  onPageChange,
  onDelete,
}: AdminBookListProps) {
  // Dummy filter/sort options for FilterSortControls
  const availableFilters = [
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "sell", label: "Sell" },
        { value: "exchange", label: "Exchange" },
        { value: "borrow", label: "Borrow" },
      ],
    },
    // Add filter by owner, status, etc.
  ];
  const availableSorts = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "createdAt", label: "Created At" },
  ];
  const currentFilters = {}; // Replace with actual state
  const currentSort = null; // Replace with actual state

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>Admin Book Management</h1>
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
        <TableCaption>A list of books in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No books found.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Link href={`/books/${book.id}`}>{book.title}</Link>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.type}</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${book.owner.id}`}>
                    {book.owner.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(book.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(book.id)}
                    >
                      Delete
                    </Button>
                  )}
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
