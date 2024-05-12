import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
export function usePlayerHeartbeat(
  lobbyCode: string,
  activePlayerName: string
) {
  let heartbeatClientConnected = false;

  useEffect(() => {
    let heartbeatInterval: any;
    const heartbeatClient = new Client({
      brokerURL: "ws://localhost:8083/heartbeatService",
      onConnect: () => {
        if (!heartbeatClientConnected) {
          heartbeatClientConnected = true;
          heartbeatInterval = setInterval(() => {
            heartbeatClient.publish({
              destination: `/heartbeatApp/${lobbyCode}/heartbeatReceiver`,
              body: activePlayerName,
            });
          }, 3000);
        }
      },
    });
    heartbeatClient.activate();

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, []);
}
