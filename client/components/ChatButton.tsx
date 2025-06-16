"use client";

import Link from "next/link";
// Import Shadcn Button later

interface Participant {
  id: string;
  name: string;
}

interface ChatButtonProps {
  transactionId: string;
  transactionType: string;
  participants: Participant[];
}

export default function ChatButton({
  transactionId,
  transactionType,
  participants,
}: ChatButtonProps) {
  // In a real app, you might need to find or create a conversation ID based on transactionId and participants
  // For now, we'll use a placeholder or derive one simply.
  // A common pattern is to use a combination of participant IDs and transaction ID.
  // Let's assume a simple derivation for the placeholder link.
  const conversationId = `txn_${transactionId}`; // Placeholder derivation

  return (
    <Link href={`/chat/${conversationId}`}>
      {/* Shadcn Button */}
      <button>Chat</button>
    </Link>
  );
}
