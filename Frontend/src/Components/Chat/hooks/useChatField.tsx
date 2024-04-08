import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";

export function useChatField(activePlayerName: string, lobbyCode: string) {
  const stompClient = useStompClient();
  const [message, setMessage] = useState("");

  //Uses websockets to send a new message (consisting of playerName and messageText)
  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior
    if (message && stompClient) {
      //Build json message object
      const chatMessage = {
        messageSenderName: activePlayerName,
        messageText: message,
      };
      //Send message to websocket
      stompClient.publish({
        destination: `/app/${lobbyCode}/chatReceiver`,
        body: JSON.stringify(chatMessage),
      });
      // Clear the input field after sending the message
      setMessage("");
    }
  }

  return { message, setMessage, sendMessage };
}
