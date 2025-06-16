import ConversationCard from "./ConversationCard";

interface Conversation {
  id: string;
  participants: { id: string; name: string; image?: string }[];
  lastMessage?: { text: string; timestamp: string };
  unreadCount: number;
  transaction?: { id: string; type: string; bookTitle: string }; // Link to related transaction
}

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
}

export default function ConversationList({
  conversations,
  loading,
  error,
}: ConversationListProps) {
  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error loading conversations: {error}</div>;

  return (
    <div>
      <h2>My Conversations</h2>
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <ConversationCard conversation={conversation} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
