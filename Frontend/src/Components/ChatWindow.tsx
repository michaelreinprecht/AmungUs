import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";

export default function ChatWindow() {
  return (
    <div className="fixed bottom-16 right-4 bg-gray-100 border border-gray-300 mb-1 pb-4 w-96 opacity-85">
      <ChatMessageList />
      <ChatInput />
    </div>
  );
}
