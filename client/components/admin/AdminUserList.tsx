import AdminUserRow from "./AdminUserRow";
// Import Shadcn Table, Pagination, Filter/Sort/Search components later

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
  paginationData?: any; // Replace 'any'
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
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
  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;

  return (
    <div>
      <h1>Admin User Management</h1>
      {/* Filter/Sort/Search components */}
      {/* Shadcn Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <AdminUserRow
              key={user.id}
              user={user}
              onSuspend={onSuspend}
              onRestore={onRestore}
            />
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}
