import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { serverAddress } from "@/app/globals";

export function useChatField(
  activePlayerName: string,
  lobbyCode: string,
  setMessages: Dispatch<SetStateAction<string[]>>
) {
  const [message, setMessage] = useState("");
  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();
  let lobbyClientConnected = false;

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${serverAddress}:8082/chatService`,
      onConnect: () => {
        if (!lobbyClientConnected) {
          lobbyClientConnected = true;
          const subscription = client.subscribe(
            `/chat/${lobbyCode}/messages`,
            (_message) => {
              setMessages((prevMessages) => [...prevMessages, _message.body]);
            }
          );
          // Clean up previous subscriptions before subscribing again
          return () => {
            subscription?.unsubscribe();
          };
        }
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
        destination: `/chatApp/${lobbyCode}/chatReceiver`,
        body: JSON.stringify(chatMessage),
      });

      // Clear the input field after sending the message
      setMessage("");
    }
  }

  return { message, setMessage, sendMessage };
}
