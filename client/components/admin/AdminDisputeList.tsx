import { Button } from "@/components/ui/button";
import Link from "next/link";
import ErrorMessage from "../ui/ErrorMessage";
import FilterSortControls from "../ui/FilterSortControls";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
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
  paginationData?: { currentPage: number; totalPages: number };
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
  // Dummy filter/sort options for FilterSortControls
  const availableFilters = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "open", label: "Open" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
      ],
    },
    // Add filter by raisedBy, transaction details, etc.
  ];
  const availableSorts = [
    { key: "createdAt", label: "Created At" },
    { key: "status", label: "Status" },
  ];
  const currentFilters = {}; // Replace with actual state
  const currentSort = null; // Replace with actual state

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>Admin Dispute Management</h1>
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
        <TableCaption>A list of disputes in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Raised By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No disputes found.
              </TableCell>
            </TableRow>
          ) : (
            disputes.map((dispute) => (
              <TableRow key={dispute.id}>
                <TableCell>
                  <Link href={`/admin/disputes/${dispute.id}`}>
                    {dispute.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}
                  >
                    {dispute.transaction.bookTitle} ({dispute.transaction.type})
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/users/${dispute.raisedBy.id}`}>
                    {dispute.raisedBy.name}
                  </Link>
                </TableCell>
                <TableCell>{dispute.status}</TableCell>
                <TableCell>{dispute.reason.substring(0, 50)}...</TableCell>
                <TableCell>
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/disputes/${dispute.id}`}>
                    <Button variant="outline" size="sm">
                      View/Resolve
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
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
