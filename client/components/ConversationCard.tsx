import React from 'react';
import Link from 'next/link';
// Import Shadcn Card, Badge later

interface Conversation {
  id: string;
  participants: { id: string; name: string; image?: string }[];
  lastMessage?: { text: string; timestamp: string };
  unreadCount: number;
  transaction?: { id: string; type: string; bookTitle: string }; // Link to related transaction
}

interface ConversationCardProps {
  conversation: Conversation;
}

export default function ConversationCard({ conversation }: ConversationCardProps) {
  // Determine the other participant's name
  // This assumes currentUser is available or passed as a prop
  // For simplicity, just list participant names for now
  const participantNames = conversation.participants.map(p => p.name).join(', ');

  return (
    <Link href={`/chat/${conversation.id}`}>
      {/* Shadcn Card or styled div */}
      <div className="border p-3 rounded-md mb-3 flex justify-between items-center">
        <div>
          <strong>{participantNames}</strong>
          {conversation.transaction && (
            <p className="text-sm text-gray-600">Regarding: {conversation.transaction.bookTitle}</p>
          )}
          {conversation.lastMessage && (
            <p className="text-sm text-gray-800">{conversation.lastMessage.text}</p>
          )}
        </div>
        {conversation.unreadCount > 0 && (
          {/* Shadcn Badge */}
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
