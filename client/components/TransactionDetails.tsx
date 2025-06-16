import React from 'react';
import ChatButton from './ChatButton';
// Import Shadcn Button later

interface Transaction {
  id: string;
  type: 'exchange' | 'sell' | 'borrow';
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

export default function TransactionDetails({ transaction, loading, error, currentUser, onAction }: TransactionDetailsProps) {
  if (loading) return <div>Loading transaction details...</div>;
  if (error) return <div>Error loading transaction details: {error}</div>;
  if (!transaction) return <div>Transaction not found.</div>;

  const isInitiator = currentUser.id === transaction.initiator.id;
  const isReceiver = currentUser.id === transaction.receiver.id;

  return (
    <div>
      <h1>Transaction Details</h1>
      <p>Book: {transaction.book.title}</p>
      {transaction.book.image && <img src={transaction.book.image} alt={transaction.book.title} className="w-32 h-32 object-cover" />}
      <p>Type: {transaction.type}</p>
      <p>Status: {transaction.status}</p>
      <p>Initiator: {transaction.initiator.name}</p>
      <p>Receiver: {transaction.receiver.name}</p>
      <p>Created At: {new Date(transaction.createdAt).toLocaleString()}</p>
      <p>Updated At: {new Date(transaction.updatedAt).toLocaleString()}</p>

      {/* Action Buttons (Conditional based on status, type, and user role) */}
      <div>
        {transaction.status === 'pending' && isReceiver && (
          <>
            {/* Shadcn Button */}
            <button onClick={() => onAction('accept')}>Accept</button>
            {/* Shadcn Button */}
            <button onClick={() => onAction('reject')}>Reject</button>
          </>
        )}
        {transaction.status === 'pending' && isInitiator && (
           {/* Shadcn Button */}
          <button onClick={() => onAction('cancel')}>Cancel</button>
        )}
        {/* Add other buttons based on status and type (e.g., Mark Paid, Confirm Completion, Raise Dispute) */}
      </div>

      <ChatButton transactionId={transaction.id} transactionType={transaction.type} participants={[transaction.initiator, transaction.receiver]} />
    </div>
  );
}
