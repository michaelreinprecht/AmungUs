import { useEffect } from "react";
import { Client, useStompClient } from "react-stomp-hooks";

export function usePlayerHeartbeat(
    lobbyCode: string,
    activePlayerName: string
  ) {
    const stompClient = useStompClient();
  
    useEffect(() => {
      const heartbeatInterval = setInterval(() => {
        sendHeartbeat(activePlayerName, stompClient, lobbyCode);
      }, 3000);
  
      return () => {
        clearInterval(heartbeatInterval);
      };
    }, []);
  }
  
  function sendHeartbeat(playerName: string, stompClient: Client | undefined, lobbyCode: string) {
    try {
      if (stompClient) {
        stompClient.publish({
          destination: `/app/${lobbyCode}/heartbeatReceiver`,
          body: playerName,
        });
      }
    } catch (error) {
      alert("Lost connection to server!");
    }
  }
  
  