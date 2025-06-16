import { Card } from "@/components/ui/card";
import Link from "next/link";
import ChatButton from "./ChatButton";

interface Transaction {
  id: string;
  type: "exchange" | "sell" | "borrow";
  status: string; // e.g., 'pending', 'accepted', 'completed', 'cancelled'
  book: { id: string; title: string; image?: string };
  initiator: { id: string; name: string };
  receiver: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  // Add other relevant transaction details
}

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between">
      <Link
        href={`/transactions/${transaction.type}/${transaction.id}`}
        className="flex-grow mr-4"
      >
        <div className="flex items-center">
          {transaction.book.image && (
            <img
              src={transaction.book.image}
              alt={transaction.book.title}
              className="w-16 h-16 object-cover mr-4 rounded-md"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{transaction.book.title}</h3>
            <p className="text-sm text-gray-600">Type: {transaction.type}</p>
            <p className="text-sm text-gray-600">
              Status: {transaction.status}
            </p>
            <p className="text-sm text-gray-600">
              Participants: {transaction.initiator.name} vs{" "}
              {transaction.receiver.name}
            </p>
          </div>
        </div>
      </Link>
      <ChatButton
        transactionId={transaction.id}
        transactionType={transaction.type}
        participants={[transaction.initiator, transaction.receiver]}
      />
    </Card>
  );
}
