import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
export function usePlayerHeartbeat(
  lobbyCode: string,
  activePlayerName: string
) {
  useEffect(() => {
    let heartbeatInterval: any;
    const lobbyClient = new Client({
      brokerURL: "ws://localhost:8080/lobbyService",
      onConnect: () => {
        lobbyClient.publish({
          destination: `/app/${lobbyCode}/heartbeatReceiver`,
          body: activePlayerName,
        });
        heartbeatInterval = setInterval(() => {
          lobbyClient.publish({
            destination: `/app/${lobbyCode}/heartbeatReceiver`,
            body: activePlayerName,
          });
        }, 3000);
      },
    });
    lobbyClient.activate();

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, []);
}
