// Import Shadcn Table, Pagination, Filter/Sort/Search components later

interface Dispute {
  id: string;
  transaction: { id: string; type: string; bookTitle: string };
  raisedBy: { id: string; name: string };
  status: "open" | "resolving" | "resolved" | "closed";
  reason: string;
  createdAt: string;
  // Add other relevant dispute fields
}

interface AdminDisputeListProps {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any'
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
}

export default function AdminDisputeList({
  disputes,
  loading,
  error,
  paginationData,
  onFilter,
  onSort,
  onSearch,
  onPageChange,
}: AdminDisputeListProps) {
  if (loading) return <div>Loading disputes...</div>;
  if (error) return <div>Error loading disputes: {error}</div>;

  return (
    <div>
      <h1>Admin Dispute Management</h1>
      {/* Filter/Sort/Search components */}
      {/* Shadcn Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction</th>
            <th>Raised By</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <tr key={dispute.id}>
              <td>
                <Link href={`/admin/disputes/${dispute.id}`}>{dispute.id}</Link>
              </td>
              <td>
                <Link
                  href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}
                >
                  {dispute.transaction.bookTitle} ({dispute.transaction.type})
                </Link>
              </td>
              <td>
                <Link href={`/admin/users/${dispute.raisedBy.id}`}>
                  {dispute.raisedBy.name}
                </Link>
              </td>
              <td>{dispute.status}</td>
              <td>{dispute.reason.substring(0, 50)}...</td>
              <td>{new Date(dispute.createdAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/disputes/${dispute.id}`}>
                  {/* Shadcn Button */}
                  <button>View/Resolve</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}
