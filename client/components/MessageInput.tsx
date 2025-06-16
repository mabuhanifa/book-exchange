"use client";

import React, { useState } from "react";
// Import Shadcn Input, Button later
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  sending: boolean;
}

export default function MessageInput({
  onSendMessage,
  sending,
}: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      {/* Shadcn Input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
        className="flex-grow"
      />
      {/* Shadcn Button */}
      <button type="submit" disabled={!text.trim() || sending}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
