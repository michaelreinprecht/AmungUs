import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";
import ChatFieldButton from "./ChatFieldButton";
import ChatFieldInput from "./ChatFieldInput";

export default function ChatField() {
  const stompClient = useStompClient();
  const [message, setMessage] = useState("");

  //Uses websockets to send a new message (consisting of playerName and messageText)
  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior
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
      // Clear the input field after sending the message
      setMessage("");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <form onSubmit={sendMessage}>
        <div className="flex w-full">
          <div className="flex-grow">
            <ChatFieldInput message={message} setMessage={setMessage} />
          </div>
          <ChatFieldButton buttonText="Send" />
        </div>
      </form>
    </div>
  );
}
