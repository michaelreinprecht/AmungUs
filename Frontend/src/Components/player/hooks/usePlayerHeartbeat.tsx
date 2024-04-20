import { sendHeartbeat } from "@/Components/utilityFunctions/webSocketHandler";
import { useEffect } from "react";
import { useStompClient } from "react-stomp-hooks";

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
  
  