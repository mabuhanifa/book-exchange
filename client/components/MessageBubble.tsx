interface Message {
  id: string;
  sender: { id: string; name: string };
  text: string;
  timestamp: string;
  readStatus: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({
  message,
  isCurrentUser,
}: MessageBubbleProps) {
  const bubbleClass = isCurrentUser
    ? "bg-blue-500 text-white self-end rounded-br-none"
    : "bg-gray-300 text-black self-start rounded-bl-none";

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${bubbleClass}`}>
        {!isCurrentUser && (
          <div className="font-semibold text-sm mb-1">
            {message.sender.name}
          </div>
        )}
        <p>{message.text}</p>
        <div className="text-xs mt-1 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isCurrentUser && (message.readStatus ? " ✓✓" : " ✓")}{" "}
          {/* Simple read status indicator */}
        </div>
      </div>
    </div>
  );
}
