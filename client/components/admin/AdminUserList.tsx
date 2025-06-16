import ErrorMessage from "../ui/ErrorMessage";
import FilterSortControls from "../ui/FilterSortControls";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
import AdminUserRow from "./AdminUserRow";
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

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: string;
  // Add other user fields
}

interface AdminUserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  paginationData?: { currentPage: number; totalPages: number };
  onPageChange?: (page: number) => void;
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onSuspend?: (userId: string) => void;
  onRestore?: (userId: string) => void;
}

export default function AdminUserList({
  users,
  loading,
  error,
  paginationData,
  onFilter,
  onSort,
  onSearch,
  onPageChange,
  onSuspend,
  onRestore,
}: AdminUserListProps) {
  // Dummy filter/sort options for FilterSortControls
  const availableFilters = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ],
    },
  ];
  const availableSorts = [
    { key: "name", label: "Name" },
    { key: "createdAt", label: "Created At" },
  ];
  const currentFilters = {}; // Replace with actual state
  const currentSort = null; // Replace with actual state

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>Admin User Management</h1>
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
        <TableCaption>A list of users in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <AdminUserRow
                key={user.id}
                user={user}
                onSuspend={onSuspend}
                onRestore={onRestore}
              />
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
