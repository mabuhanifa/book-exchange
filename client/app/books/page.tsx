// This is a Server Component

import BookList from "@/components/BookList";
import { callBackendApi } from "@/lib/api"; // Use the server-side API utility

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

// Server Component data fetching
async function getBooks(): Promise<Book[]> {
  try {
    // Call the backend API directly from the Server Component
    // Or call your Next.js proxy handler if you prefer
    const books = await callBackendApi("GET", "/books"); // Example: GET /api/books
    return books;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    // Handle error appropriately, maybe return empty array or throw
    return [];
  }
}

export default async function BooksPage() {
  const books = await getBooks();

  // Dummy pagination data and handlers for the client component
  const paginationData = { currentPage: 1, totalPages: 1 };
  const handlePageChange = (page: number) =>
    console.log("Page changed to", page);
  const handleFilterChange = (filters: any) =>
    console.log("Filter changed:", filters);
  const handleSortChange = (sort: any) => console.log("Sort changed:", sort);

  return (
    <div>
      <h1>Books Listing</h1>
      {/* Pass fetched data to the Client Component */}
      <BookList
        books={books}
        loading={false} // Loading is handled by Server Component fetch
        error={null} // Error handling needs refinement for Server Components
        paginationData={paginationData} // Pass dummy data for now
        onPageChange={handlePageChange} // Pass dummy handler
        onFilterChange={handleFilterChange} // Pass dummy handler
        onSortChange={handleSortChange} // Pass dummy handler
      />
    </div>
  );
}
