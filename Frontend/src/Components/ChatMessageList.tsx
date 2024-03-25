import { useEffect, useRef, useState } from "react";
import { useSubscription } from "react-stomp-hooks";

export default function ChatMessageList() {
  const [messages, setMessages] = useState<Array<string>>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // UseEffect is a react function, it gets called whenever the passed list (in this case messages) is changed.
  // In this case we use it so scroll to the bottom of the list once a new message is added.
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [messages]);

  useSubscription("/chat/messages", (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      JSON.parse(message.body).content,
    ]);
  });

  return (
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
  );
}
