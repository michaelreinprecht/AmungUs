import { useEffect, useRef, useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import ChatMessageListItem from "./ChatMessageListItem";

type ChatMessageListProps = {
  showChat: boolean;
  setShowChat: (newShowChat: boolean) => void;
  lobbyCode: string;
};

export default function ChatMessageList({
  showChat,
  setShowChat,
  lobbyCode,
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

  //Subscribe to messages websocket
  useSubscription(`/chat/${lobbyCode}/messages`, (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      JSON.parse(message.body).content,
    ]);
  });

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
