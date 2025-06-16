"use client";

import AdminReviewList from "@/components/admin/AdminReviewList";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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

// Dummy fetch function - replace with your actual API call that accepts params
const fetchAllReviews = async (params: {
  page?: string;
  limit?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}): Promise<{ data: Review[]; totalPages: number; currentPage: number }> => {
  console.log("Fetching all reviews for admin with params:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate filtering, sorting, pagination based on params
  let dummyReviews: Review[] = [
    {
      id: "r1",
      reviewer: { id: "user3", name: "David" },
      reviewee: { id: "user1", name: "Alice" },
      rating: 5,
      comment: "Great exchange!",
      transactionId: "t1",
      createdAt: "2023-01-26T10:00:00Z",
      status: "approved",
    },
    {
      id: "r2",
      reviewer: { id: "user1", name: "Alice" },
      reviewee: { id: "user3", name: "David" },
      rating: 4,
      comment: "Smooth transaction.",
      transactionId: "t1",
      createdAt: "2023-01-27T11:00:00Z",
      status: "approved",
    },
    {
      id: "r3",
      reviewer: { id: "user2", name: "Bob" },
      reviewee: { id: "user4", name: "Eve" },
      rating: 1,
      comment: "Bad experience.",
      transactionId: "t2",
      createdAt: "2023-02-28T12:00:00Z",
      status: "pending",
    },
  ];

  // Apply filters
  if (params.status) {
    dummyReviews = dummyReviews.filter(
      (review) => review.status === params.status
    );
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    dummyReviews = dummyReviews.filter(
      (review) =>
        review.reviewer.name.toLowerCase().includes(searchTerm) ||
        review.reviewee.name.toLowerCase().includes(searchTerm) ||
        review.comment.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    dummyReviews.sort((a, b) => {
      const aValue = (a as any)[params.sortBy as keyof Review];
      const bValue = (b as any)[params.sortBy as keyof Review];
      if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10); // Default limit
  const totalItems = dummyReviews.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReviews = dummyReviews.slice(startIndex, endIndex);

  return {
    data: paginatedReviews,
    totalPages: totalPages || 1,
    currentPage: page,
  };
};

export default function AdminReviewsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read params from URL
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const statusFilter = searchParams.get("status");
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const searchQuery = searchParams.get("search");

  // Use TanStack Query to fetch reviews based on URL params
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminReviews",
      {
        page,
        limit,
        status: statusFilter,
        sortBy,
        sortDirection,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      fetchAllReviews({
        page,
        limit,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const reviews = data?.data || [];
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
  const handleModerate = (reviewId: string, status: "approved" | "rejected") =>
    console.log(`Moderate review ${reviewId} as ${status}`);

  return (
    <div>
      <h1>Admin Review Moderation</h1>
      <AdminReviewList
        reviews={reviews}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onSearch={handleSearch}
        onModerate={handleModerate}
        // Pass current filter/sort/search values to FilterSortControls
        currentFilters={{ status: statusFilter }}
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
