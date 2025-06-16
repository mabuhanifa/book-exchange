"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

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
      <Input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
        className="flex-grow"
      />
      <Button type="submit" disabled={!text.trim() || sending}>
        {sending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
