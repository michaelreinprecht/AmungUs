import { useChatMessageList } from "./hooks/useChatMessageList";
import ChatMessageListItem from "./ChatMessageListItem";

type ChatMessageListProps = {
  showChat: boolean;
  setShowChat: (newShowChat: boolean) => void;
  messages: string[];
};

export default function ChatMessageList({
  showChat,
  setShowChat,
  messages,
}: ChatMessageListProps) {
  const { tableRef } = useChatMessageList(messages, setShowChat);

  return (
    <>
      {showChat && messages.length > 0 && (
        <div className="fixed bottom-16 right-4 bg-gray-100 border border-gray-300 pb-2 w-96 opacity-85">
          <div className="overflow-y-auto max-h-40 w-full" ref={tableRef}>
            <table id="chatMessageList" className="table table-striped">
              <tbody className="text-left" id="messages">
                {messages.map((message, index) => (
                  <ChatMessageListItem message={message} key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
