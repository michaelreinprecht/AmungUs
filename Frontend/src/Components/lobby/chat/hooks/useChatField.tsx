import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useChatField(
  activePlayerName: string,
  lobbyCode: string,
  setMessages: Dispatch<SetStateAction<string[]>>
) {
  const [message, setMessage] = useState("");
  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/lobbyService",
      onConnect: () => {
        const subscription = client.subscribe(
          `/lobby/${lobbyCode}/messages`,
          (_message) => {
            console.log("Received message: ", _message.body);
            setMessages((prevMessages) => [...prevMessages, _message.body]);
          }
        );
        // Clean up previous subscriptions before subscribing again
        return () => {
          subscription?.unsubscribe();
        };
      },
    });
    client.activate();
    setLobbyClient(client);
  }, []);

  //Uses websockets to send a new message (consisting of playerName and messageText)
  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior
    if (message) {
      //Build json message object
      const chatMessage = {
        messageSenderName: activePlayerName,
        messageText: message,
      };
      //Send message to websocket

      lobbyClient?.publish({
        destination: `/app/${lobbyCode}/chatReceiver`,
        body: JSON.stringify(chatMessage),
      });

      // Clear the input field after sending the message
      setMessage("");
    }
  }

  return { message, setMessage, sendMessage };
}
