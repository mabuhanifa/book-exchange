"use client";

import AdminUserList from "@/components/admin/AdminUserList";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: string;
}

// Dummy fetch function - replace with your actual API call
const fetchAllUsers = async (): Promise<User[]> => {
  console.log("Fetching all users for admin");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Return dummy data
  return [
    {
      id: "user1",
      name: "Alice",
      phoneNumber: "111",
      role: "user",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user2",
      name: "Bob",
      phoneNumber: "222",
      role: "user",
      status: "suspended",
      createdAt: new Date().toISOString(),
    },
    {
      id: "admin1",
      name: "Charlie",
      phoneNumber: "333",
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];
};

export default function AdminUsersPage() {
  // Use TanStack Query to fetch all users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: fetchAllUsers,
  });

  // Dummy pagination, filter, sort, search, and action handlers
  const paginationData = { currentPage: 1, totalPages: 1 };
  const handlePageChange = (page: number) =>
    console.log("Admin users page changed to", page);
  const handleFilter = (filters: any) =>
    console.log("Admin users filter:", filters);
  const handleSort = (sort: any) => console.log("Admin users sort:", sort);
  const handleSearch = (query: string) =>
    console.log("Admin users search:", query);
  const handleSuspend = (userId: string) =>
    console.log("Suspend user:", userId);
  const handleRestore = (userId: string) =>
    console.log("Restore user:", userId);

  return (
    <div>
      <h1>Admin User Management</h1>
      <AdminUserList
        users={users || []}
        loading={isLoading}
        error={error ? error.message : null}
        paginationData={paginationData} // Pass dummy data
        onPageChange={handlePageChange} // Pass dummy handler
        onFilter={handleFilter} // Pass dummy handler
        onSort={handleSort} // Pass dummy handler
        onSearch={handleSearch} // Pass dummy handler
        onSuspend={handleSuspend} // Pass dummy handler
        onRestore={handleRestore} // Pass dummy handler
      />
    </div>
  );
}
