"use client";

import UserBookList from "@/components/UserBookList";
import { useQuery } from "@tanstack/react-query";
// Import useAuthStore if needed to get currentUser ID for the fetch

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

// Dummy fetch function - replace with your actual API call
const fetchMyBooks = async (userId: string): Promise<Book[]> => {
  console.log("Fetching books for user:", userId);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Return dummy data
  return [
    {
      id: "b1",
      title: "My Book 1",
      author: "Author A",
      condition: "good",
      type: "sell",
      price: 10,
      availability: "available",
    },
    {
      id: "b2",
      title: "My Book 2",
      author: "Author B",
      condition: "like new",
      type: "exchange",
      exchangeFor: "Fantasy",
      availability: "available",
    },
  ];
};

export default function MyBooksPage() {
  // Get currentUser ID from auth store or session
  const currentUser = { id: "user123" }; // Placeholder - replace with actual user ID

  // Use TanStack Query to fetch user's books
  const {
    data: books,
    isLoading,
    error,
  } = useQuery<Book[]>({
    queryKey: ["myBooks", currentUser.id], // Include user ID in query key
    queryFn: () => fetchMyBooks(currentUser.id),
    enabled: !!currentUser.id, // Only fetch if user ID is available
  });

  // Dummy pagination data and handlers
  const paginationData = { currentPage: 1, totalPages: 1 };
  const handlePageChange = (page: number) =>
    console.log("Page changed to", page);

  return (
    <div>
      <h1>My Books</h1>
      <UserBookList
        books={books || []}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData} // Pass dummy data for now
        onPageChange={handlePageChange} // Pass dummy handler
      />
    </div>
  );
}
