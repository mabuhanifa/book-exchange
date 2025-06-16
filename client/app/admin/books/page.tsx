"use client";

import AdminBookList from "@/components/admin/AdminBookList";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  type: "exchange" | "sell" | "borrow";
  owner: { id: string; name: string };
  createdAt: string;
  // Add other relevant book fields
}

// Dummy fetch function - replace with your actual API call that accepts params
const fetchAllBooks = async (params: {
  page?: string;
  limit?: string;
  type?: string;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}): Promise<{ data: Book[]; totalPages: number; currentPage: number }> => {
  console.log("Fetching all books for admin with params:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate filtering, sorting, pagination based on params
  let dummyBooks: Book[] = [
    {
      id: "b1",
      title: "Book A",
      author: "Author 1",
      type: "sell",
      owner: { id: "user1", name: "Alice" },
      createdAt: "2023-01-15T10:00:00Z",
    },
    {
      id: "b2",
      title: "Book B",
      author: "Author 2",
      type: "exchange",
      owner: { id: "user2", name: "Bob" },
      createdAt: "2023-02-20T11:00:00Z",
    },
    {
      id: "b3",
      title: "Book C",
      author: "Author 1",
      type: "borrow",
      owner: { id: "user1", name: "Alice" },
      createdAt: "2023-03-10T12:00:00Z",
    },
    {
      id: "b4",
      title: "Book D",
      author: "Author 3",
      type: "sell",
      owner: { id: "user3", name: "David" },
      createdAt: "2023-04-01T13:00:00Z",
    },
    {
      id: "b5",
      title: "Book E",
      author: "Author 2",
      type: "exchange",
      owner: { id: "user4", name: "Eve" },
      createdAt: "2023-05-05T14:00:00Z",
    },
  ];

  // Apply filters
  if (params.type) {
    dummyBooks = dummyBooks.filter((book) => book.type === params.type);
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    dummyBooks = dummyBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.owner.name.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    dummyBooks.sort((a, b) => {
      const aValue = (a as any)[params.sortBy as keyof Book];
      const bValue = (b as any)[params.sortBy as keyof Book];
      if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10); // Default limit
  const totalItems = dummyBooks.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = dummyBooks.slice(startIndex, endIndex);

  return {
    data: paginatedBooks,
    totalPages: totalPages || 1,
    currentPage: page,
  };
};

export default function AdminBooksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read params from URL
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const typeFilter = searchParams.get("type");
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const searchQuery = searchParams.get("search");

  // Use TanStack Query to fetch books based on URL params
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminBooks",
      {
        page,
        limit,
        type: typeFilter,
        sortBy,
        sortDirection,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      fetchAllBooks({
        page,
        limit,
        type: typeFilter || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const books = data?.data || [];
  const paginationData = {
    currentPage: data?.currentPage || 1,
    totalPages: data?.totalPages || 1,
  };

  // Create query string
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  // Handlers to update URL search params
  const handlePageChange = (newPage: number) => {
    router.push(pathname + "?" + createQueryString("page", newPage.toString()));
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(pathname + "?" + params.toString());
  };

  const handleSortChange = (
    sort: { key: string; direction: "asc" | "desc" } | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) {
      params.set("sortBy", sort.key);
      params.set("sortDirection", sort.direction);
    } else {
      params.delete("sortBy");
      params.delete("sortDirection");
    }
    params.set("page", "1"); // Reset to page 1 on sort change
    router.push(pathname + "?" + params.toString());
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search
    router.push(pathname + "?" + params.toString());
  };

  // Dummy action handlers
  const handleDelete = (bookId: string) => console.log("Delete book:", bookId);

  return (
    <div>
      <h1>Admin Book Management</h1>
      <AdminBookList
        books={books}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onSearch={handleSearch}
        onDelete={handleDelete}
        // Pass current filter/sort/search values to FilterSortControls
        currentFilters={{ type: typeFilter }}
        currentSort={
          sortBy
            ? {
                key: sortBy,
                direction: (sortDirection as "asc" | "desc") || "asc",
              }
            : null
        }
        currentSearch={searchQuery || ""}
      />
    </div>
  );
}
