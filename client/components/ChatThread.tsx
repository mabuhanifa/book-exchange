"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
// Import components for loading more messages later

interface Message {
  id: string;
  sender: { id: string; name: string };
  text: string;
  timestamp: string;
  readStatus: boolean;
}

interface ChatThreadProps {
  conversationId: string;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  currentUser: { id: string }; // Replace with actual user type
  onSendMessage: (text: string) => void;
  onLoadMoreMessages?: () => void;
}

export default function ChatThread({
  conversationId,
  messages,
  loading,
  sending,
  error,
  currentUser,
  onSendMessage,
  onLoadMoreMessages,
}: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom when messages change

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {" "}
      {/* Example height */}
      <h2>Chat</h2>
      {error && <div className="text-red-500">{error}</div>}
      {/* Message list container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Button/indicator to load more messages */}
        {onLoadMoreMessages && (
          <button onClick={onLoadMoreMessages}>Load More</button>
        )}
        {loading && <div>Loading messages...</div>}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUser.id}
          />
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
      {/* Message input */}
      <div className="p-4 border-t">
        <MessageInput onSendMessage={onSendMessage} sending={sending} />
      </div>
    </div>
  );
}
