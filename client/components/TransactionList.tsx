import TransactionCard from "./TransactionCard";
// Import Pagination, Filter components later

interface Transaction {
  id: string;
  type: "exchange" | "sell" | "borrow";
  status: string; // e.g., 'pending', 'accepted', 'completed', 'cancelled'
  book: { id: string; title: string; image?: string };
  initiator: { id: string; name: string }; // The user who started the transaction
  receiver: { id: string; name: string }; // The user who received the request
  createdAt: string;
  updatedAt: string;
  // Add other relevant transaction details
}

interface TransactionListProps {
  transactions: Transaction[];
  type: "buying" | "selling" | "sent" | "received" | "borrower" | "owner"; // Context of the list
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any' with actual pagination type
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: any) => void; // Replace 'any'
}

export default function TransactionList({
  transactions,
  type,
  loading,
  error,
  paginationData,
  onPageChange,
  onFilterChange,
}: TransactionListProps) {
  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error}</div>;

  return (
    <div>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Transactions</h2>
      {/* Filter component will go here */}
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
      {/* Pagination component will go here */}
    </div>
  );
}
