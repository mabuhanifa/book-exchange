"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ErrorMessage from "./ui/ErrorMessage";
import LoadingSpinner from "./ui/LoadingSpinner";

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
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <h2>Chat</h2>
      <ErrorMessage error={error} />
      {/* Message list container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Button/indicator to load more messages */}
        {onLoadMoreMessages && (
          <button onClick={onLoadMoreMessages}>Load More</button>
        )}
        <LoadingSpinner isLoading={loading} />
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.sender.id === currentUser.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message input */}
      <div className="p-4 border-t">
        <MessageInput onSendMessage={onSendMessage} sending={sending} />
      </div>
    </div>
  );
}
