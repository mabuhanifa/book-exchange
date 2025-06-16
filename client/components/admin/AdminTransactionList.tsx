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

interface AdminTransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  paginationData?: { currentPage: number; totalPages: number };
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
}

export default function AdminTransactionList({
  transactions,
  loading,
  error,
  paginationData,
  onFilter,
  onSort,
  onSearch,
  onPageChange,
}: AdminTransactionListProps) {
  // Dummy filter/sort options for FilterSortControls
  const availableFilters = [
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "sell", label: "Sell" },
        { value: "exchange", label: "Exchange" },
        { value: "borrow", label: "Borrow" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    // Add filter by participants, book title, etc.
  ];
  const availableSorts = [
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
  ];
  const currentFilters = {}; // Replace with actual state
  const currentSort = null; // Replace with actual state

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      <h1>Admin Transaction View</h1>
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
        <TableCaption>A list of all transactions in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Initiator</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Link
                    href={`/transactions/${transaction.type}/${transaction.id}`}
                  >
                    {transaction.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  <Link href={`/books/${transaction.book.id}`}>
                    {transaction.book.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/users/${transaction.initiator.id}`}>
                    {transaction.initiator.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/users/${transaction.receiver.id}`}>
                    {transaction.receiver.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {/* Link to dispute if exists, or other admin actions */}
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
