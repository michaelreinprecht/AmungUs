import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
export function usePlayerHeartbeat(
  lobbyCode: string,
  activePlayerName: string
) {
  useEffect(() => {
    let heartbeatInterval: any;
    const lobbyClient = new Client({
      brokerURL: "ws://localhost:8083/heartbeatService",
      onConnect: () => {
        lobbyClient.publish({
          destination: `/heartbeatApp/${lobbyCode}/heartbeatReceiver`,
          body: activePlayerName,
        });
        heartbeatInterval = setInterval(() => {
          lobbyClient.publish({
            destination: `/heartbeatApp/${lobbyCode}/heartbeatReceiver`,
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
