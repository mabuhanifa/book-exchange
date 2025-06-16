"use client";

import AdminTransactionList from "@/components/admin/AdminTransactionList";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Transaction {
  id: string;
  type: "exchange" | "sell" | "borrow";
  status: string;
  book: { id: string; title: string };
  initiator: { id: string; name: string };
  receiver: { id: string; name: string };
  createdAt: string;
  // Add other relevant transaction fields
}

// Dummy fetch function - replace with your actual API call that accepts params
const fetchAllTransactions = async (params: {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}): Promise<{
  data: Transaction[];
  totalPages: number;
  currentPage: number;
}> => {
  console.log("Fetching all transactions for admin with params:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate filtering, sorting, pagination based on params
  let dummyTransactions: Transaction[] = [
    {
      id: "t1",
      type: "sell",
      status: "completed",
      book: { id: "b1", title: "Book A" },
      initiator: { id: "user1", name: "Alice" },
      receiver: { id: "user3", name: "David" },
      createdAt: "2023-01-20T10:00:00Z",
    },
    {
      id: "t2",
      type: "exchange",
      status: "pending",
      book: { id: "b2", title: "Book B" },
      initiator: { id: "user2", name: "Bob" },
      receiver: { id: "user4", name: "Eve" },
      createdAt: "2023-02-25T11:00:00Z",
    },
    {
      id: "t3",
      type: "borrow",
      status: "active",
      book: { id: "b3", title: "Book C" },
      initiator: { id: "user1", name: "Alice" },
      receiver: { id: "user2", name: "Bob" },
      createdAt: "2023-03-15T12:00:00Z",
    },
    {
      id: "t4",
      type: "sell",
      status: "cancelled",
      book: { id: "b4", title: "Book D" },
      initiator: { id: "user3", name: "David" },
      receiver: { id: "user1", name: "Alice" },
      createdAt: "2023-04-05T13:00:00Z",
    },
    {
      id: "t5",
      type: "exchange",
      status: "completed",
      book: { id: "b5", title: "Book E" },
      initiator: { id: "user4", name: "Eve" },
      receiver: { id: "user1", name: "Alice" },
      createdAt: "2023-05-10T14:00:00Z",
    },
  ];

  // Apply filters
  if (params.type) {
    dummyTransactions = dummyTransactions.filter(
      (txn) => txn.type === params.type
    );
  }
  if (params.status) {
    dummyTransactions = dummyTransactions.filter(
      (txn) => txn.status === params.status
    );
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    dummyTransactions = dummyTransactions.filter(
      (txn) =>
        txn.book.title.toLowerCase().includes(searchTerm) ||
        txn.initiator.name.toLowerCase().includes(searchTerm) ||
        txn.receiver.name.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    dummyTransactions.sort((a, b) => {
      const aValue = (a as any)[params.sortBy as keyof Transaction];
      const bValue = (b as any)[params.sortBy as keyof Transaction];
      if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10); // Default limit
  const totalItems = dummyTransactions.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTransactions = dummyTransactions.slice(startIndex, endIndex);

  return {
    data: paginatedTransactions,
    totalPages: totalPages || 1,
    currentPage: page,
  };
};

export default function AdminTransactionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read params from URL
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const typeFilter = searchParams.get("type");
  const statusFilter = searchParams.get("status");
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const searchQuery = searchParams.get("search");

  // Use TanStack Query to fetch transactions based on URL params
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminTransactions",
      {
        page,
        limit,
        type: typeFilter,
        status: statusFilter,
        sortBy,
        sortDirection,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      fetchAllTransactions({
        page,
        limit,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const transactions = data?.data || [];
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
      <h1>Admin Transaction View</h1>
      <AdminTransactionList
        transactions={transactions}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onSearch={handleSearch}
        // Pass current filter/sort/search values to FilterSortControls
        currentFilters={{ type: typeFilter, status: statusFilter }}
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
