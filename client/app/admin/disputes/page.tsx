"use client";

import AdminDisputeList from "@/components/admin/AdminDisputeList";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Dispute {
  id: string;
  transaction: { id: string; type: string; bookTitle: string };
  raisedBy: { id: string; name: string };
  status: "open" | "resolving" | "resolved" | "closed";
  reason: string;
  createdAt: string;
  // Add other relevant dispute fields
}

// Dummy fetch function - replace with your actual API call that accepts params
const fetchAllDisputes = async (params: {
  page?: string;
  limit?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}): Promise<{ data: Dispute[]; totalPages: number; currentPage: number }> => {
  console.log("Fetching all disputes for admin with params:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate filtering, sorting, pagination based on params
  let dummyDisputes: Dispute[] = [
    {
      id: "d1",
      transaction: { id: "t1", type: "sell", bookTitle: "Book A" },
      raisedBy: { id: "user1", name: "Alice" },
      status: "open",
      reason: "Item not received",
      createdAt: "2023-01-25T10:00:00Z",
    },
    {
      id: "d2",
      transaction: { id: "t2", type: "exchange", bookTitle: "Book B" },
      raisedBy: { id: "user4", name: "Eve" },
      status: "resolved",
      reason: "Book condition misrepresented",
      createdAt: "2023-03-01T11:00:00Z",
    },
    {
      id: "d3",
      transaction: { id: "t3", type: "borrow", bookTitle: "Book C" },
      raisedBy: { id: "user2", name: "Bob" },
      status: "open",
      reason: "Book not returned",
      createdAt: "2023-03-20T12:00:00Z",
    },
  ];

  // Apply filters
  if (params.status) {
    dummyDisputes = dummyDisputes.filter(
      (dispute) => dispute.status === params.status
    );
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    dummyDisputes = dummyDisputes.filter(
      (dispute) =>
        dispute.transaction.bookTitle.toLowerCase().includes(searchTerm) ||
        dispute.raisedBy.name.toLowerCase().includes(searchTerm) ||
        dispute.reason.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    dummyDisputes.sort((a, b) => {
      const aValue = (a as any)[params.sortBy as keyof Dispute];
      const bValue = (b as any)[params.sortBy as keyof Dispute];
      if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10); // Default limit
  const totalItems = dummyDisputes.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDisputes = dummyDisputes.slice(startIndex, endIndex);

  return {
    data: paginatedDisputes,
    totalPages: totalPages || 1,
    currentPage: page,
  };
};

export default function AdminDisputesPage() {
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

  // Use TanStack Query to fetch disputes based on URL params
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminDisputes",
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
      fetchAllDisputes({
        page,
        limit,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const disputes = data?.data || [];
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

  return (
    <div>
      <h1>Admin Dispute Management</h1>
      <AdminDisputeList
        disputes={disputes}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onSearch={handleSearch}
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
