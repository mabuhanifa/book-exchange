import Link from "next/link";
// Import Shadcn Table, Pagination, Filter/Sort/Search components later

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
  paginationData?: any; // Replace 'any'
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
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error}</div>;

  return (
    <div>
      <h1>Admin Transaction View</h1>
      {/* Filter/Sort/Search components */}
      {/* Shadcn Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Book</th>
            <th>Initiator</th>
            <th>Receiver</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <Link
                  href={`/transactions/${transaction.type}/${transaction.id}`}
                >
                  {transaction.id}
                </Link>
              </td>
              <td>{transaction.type}</td>
              <td>{transaction.status}</td>
              <td>
                <Link href={`/books/${transaction.book.id}`}>
                  {transaction.book.title}
                </Link>
              </td>
              <td>
                <Link href={`/admin/users/${transaction.initiator.id}`}>
                  {transaction.initiator.name}
                </Link>
              </td>
              <td>
                <Link href={`/admin/users/${transaction.receiver.id}`}>
                  {transaction.receiver.name}
                </Link>
              </td>
              <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
              <td>{/* Link to dispute if exists, or other admin actions */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}
