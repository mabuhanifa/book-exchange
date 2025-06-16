import { Button } from "@/components/ui/button";
import ChatButton from "./ChatButton";
import ErrorMessage from "./ui/ErrorMessage";
import LoadingSpinner from "./ui/LoadingSpinner";

interface Transaction {
  id: string;
  type: "exchange" | "sell" | "borrow";
  status: string; // e.g., 'pending', 'accepted', 'completed', 'cancelled'
  book: { id: string; title: string; description: string; image?: string };
  initiator: { id: string; name: string };
  receiver: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  // Add other relevant transaction details like price, exchange details, borrow dates, etc.
}

interface TransactionDetailsProps {
  transaction: Transaction;
  loading: boolean;
  error: string | null;
  currentUser: { id: string }; // Replace with actual user type
  onAction: (action: string) => void; // Callback for button actions
}

export default function TransactionDetails({
  transaction,
  loading,
  error,
  currentUser,
  onAction,
}: TransactionDetailsProps) {
  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;
  if (!transaction) return <div>Transaction not found.</div>;

  const isInitiator = currentUser.id === transaction.initiator.id;
  const isReceiver = currentUser.id === transaction.receiver.id;

  return (
    <div className="space-y-4">
      <h1>Transaction Details</h1>
      <p>
        <strong>Book:</strong> {transaction.book.title}
      </p>
      {transaction.book.image && (
        <img
          src={transaction.book.image}
          alt={transaction.book.title}
          className="w-32 h-32 object-cover rounded-md"
        />
      )}
      <p>
        <strong>Type:</strong> {transaction.type}
      </p>
      <p>
        <strong>Status:</strong> {transaction.status}
      </p>
      <p>
        <strong>Initiator:</strong> {transaction.initiator.name}
      </p>
      <p>
        <strong>Receiver:</strong> {transaction.receiver.name}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(transaction.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong>{" "}
        {new Date(transaction.updatedAt).toLocaleString()}
      </p>

      {/* Action Buttons (Conditional based on status, type, and user role) */}
      <div className="flex space-x-4">
        {transaction.status === "pending" && isReceiver && (
          <>
            <Button onClick={() => onAction("accept")}>Accept</Button>
            <Button variant="destructive" onClick={() => onAction("reject")}>
              Reject
            </Button>
          </>
        )}
        {transaction.status === "pending" && isInitiator && (
          <Button variant="destructive" onClick={() => onAction("cancel")}>
            Cancel
          </Button>
        )}
        {/* Add other buttons based on status and type (e.g., Mark Paid, Confirm Completion, Raise Dispute) */}
      </div>

      <ChatButton
        transactionId={transaction.id}
        transactionType={transaction.type}
        participants={[transaction.initiator, transaction.receiver]}
      />
    </div>
  );
}
