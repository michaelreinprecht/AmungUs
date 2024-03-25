import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";
import ChatFieldInput from "./ChatFieldInput";
import ChatFieldButton from "./ChatFieldButton";

type ChatFieldProps = {
  setShowChat: (newShowChat: boolean) => void;
};

export default function ChatField({ setShowChat }: ChatFieldProps) {
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
          <ChatFieldInput
            message={message}
            setMessage={setMessage}
            setShowChat={setShowChat}
          />
        </div>
        <ChatFieldButton buttonText="Send" sendMessage={sendMessage} />
      </div>
    </div>
  );
}
