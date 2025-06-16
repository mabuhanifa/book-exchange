"use client";

import AdminUserList from "@/components/admin/AdminUserList";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: string;
}

// Dummy fetch function - replace with your actual API call that accepts params
const fetchAllUsers = async (params: {
  page?: string;
  limit?: string;
  status?: string;
  role?: string;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}): Promise<{
  data: User[];
  totalPages: number;
  currentPage: number;
}> => {
  console.log("Fetching all users for admin with params:", params);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate filtering, sorting, pagination based on params
  let dummyUsers: User[] = [
    {
      id: "user1",
      name: "Alice",
      phoneNumber: "111",
      role: "user",
      status: "active",
      createdAt: "2023-01-15T10:00:00Z",
    },
    {
      id: "user2",
      name: "Bob",
      phoneNumber: "222",
      role: "user",
      status: "suspended",
      createdAt: "2023-02-20T11:00:00Z",
    },
    {
      id: "admin1",
      name: "Charlie",
      phoneNumber: "333",
      role: "admin",
      status: "active",
      createdAt: "2023-03-10T12:00:00Z",
    },
    {
      id: "user3",
      name: "David",
      phoneNumber: "444",
      role: "user",
      status: "active",
      createdAt: "2023-04-01T13:00:00Z",
    },
    {
      id: "user4",
      name: "Eve",
      phoneNumber: "555",
      role: "user",
      status: "active",
      createdAt: "2023-05-05T14:00:00Z",
    },
  ];

  // Apply filters
  if (params.status) {
    dummyUsers = dummyUsers.filter((user) => user.status === params.status);
  }
  if (params.role) {
    dummyUsers = dummyUsers.filter((user) => user.role === params.role);
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    dummyUsers = dummyUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.phoneNumber.includes(searchTerm)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    dummyUsers.sort((a, b) => {
      const aValue = (a as any)[params.sortBy as keyof User];
      const bValue = (b as any)[params.sortBy as keyof User];
      if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "10", 10); // Default limit
  const totalItems = dummyUsers.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = dummyUsers.slice(startIndex, endIndex);

  return {
    data: paginatedUsers,
    totalPages: totalPages || 1, // Ensure at least 1 page
    currentPage: page,
  };
};

export default function AdminUsersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read params from URL
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const statusFilter = searchParams.get("status");
  const roleFilter = searchParams.get("role");
  const sortBy = searchParams.get("sortBy");
  const sortDirection = searchParams.get("sortDirection");
  const searchQuery = searchParams.get("search");

  // Use TanStack Query to fetch users based on URL params
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "adminUsers",
      {
        page,
        limit,
        status: statusFilter,
        role: roleFilter,
        sortBy,
        sortDirection,
        search: searchQuery,
      },
    ],
    queryFn: () =>
      fetchAllUsers({
        page,
        limit,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
        search: searchQuery || undefined,
      }),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page/filters
  });

  const users = data?.data || [];
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
  const handleSuspend = (userId: string) =>
    console.log("Suspend user:", userId);
  const handleRestore = (userId: string) =>
    console.log("Restore user:", userId);

  return (
    <div>
      <h1>Admin User Management</h1>
      <AdminUserList
        users={users}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        onFilter={handleFilterChange}
        onSort={handleSortChange}
        onSearch={handleSearch}
        onSuspend={handleSuspend}
        onRestore={handleRestore}
        // Pass current filter/sort/search values to FilterSortControls
        currentFilters={{ status: statusFilter, role: roleFilter }}
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
