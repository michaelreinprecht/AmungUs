import { useEffect, useRef, useState } from "react";
import { useSubscription } from "react-stomp-hooks";

type ChatMessageListProps = {
  showChat: boolean;
  setShowChat: (newShowChat: boolean) => void;
};

export default function ChatMessageList({
  showChat,
  setShowChat,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState<Array<string>>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // UseEffect is a react function, it gets called whenever the passed list (in this case messages) is changed.
  // In this case we use it so scroll to the bottom of the list once a new message is added.
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }

    // Show the chat message list when a new message is added
    setShowChat(true);

    // Set a timeout to hide the chat message list after 5 seconds
    setTimeout(() => {
      setShowChat(false);
    }, 5000);
  }, [messages]);

  useSubscription("/chat/messages", (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      JSON.parse(message.body).content,
    ]);
  });

  return (
    <>
      {showChat && messages.length > 0 && (
        <div className="fixed bottom-16 right-4 bg-gray-100 border border-gray-300 mb-1 pb-4 w-96 opacity-85">
          <div className="mb-4 overflow-y-auto max-h-40 w-full" ref={tableRef}>
            <table id="chatMessageList" className="table table-striped">
              <tbody className="text-left" id="messages">
                {messages.map((greeting, index) => (
                  <tr key={index}>
                    <td className="pl-2">{greeting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
