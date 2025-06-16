export default function ChatThreadPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return (
    <div>
      <h1>Chat Thread for ID: {params.conversationId}</h1>
      {/* Chat messages and input will go here */}
    </div>
  );
}
