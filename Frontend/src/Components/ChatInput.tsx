import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";

type ChatInputProps = {
  setShowChat: (newShowChat: boolean) => void;
};

export default function ChatInput({ setShowChat }: ChatInputProps) {
  const stompClient = useStompClient();
  const [message, setMessage] = useState("");

  //Uses websockets to send a new message (consisting of playerName and messageText)
  function sendMessage() {
    if (message && stompClient) {
      //Build json message object
      const chatMessage = {
        messageSenderName: "Playername", // TODO set dynamically for each player!
        messageText: message,
      };
      //Send message to websocket
      stompClient.publish({
        destination: "/app/chatReceiver",
        body: JSON.stringify(chatMessage),
      });
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <div className="flex w-full">
        <div className="flex-grow">
          <input
            type="text"
            className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
            placeholder="Your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onMouseEnter={() => setShowChat(true)}
            onMouseLeave={() => setShowChat(false)}
          />
        </div>
        <button
          className="btn btn-default bg-gray-700 text-white font-semibold py-2 px-4 rounded-r rounded-none"
          onClick={sendMessage}
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
