import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
export function usePlayerHeartbeat(
  lobbyCode: string,
  activePlayerName: string
) {
  const [heartbeatClientConnected, setHeartbeatClientConnected] =
    useState(false);
  const [heartbeatClientActivated, setHeartbeatClientActivated] =
    useState(false);

  useEffect(() => {
    let heartbeatInterval: any;
    const heartbeatClient = new Client({
      brokerURL: "ws://localhost:8083/heartbeatService",
      onConnect: () => {
        if (!heartbeatClientConnected) {
          setHeartbeatClientConnected(true);
          heartbeatInterval = setInterval(() => {
            heartbeatClient.publish({
              destination: `/heartbeatApp/${lobbyCode}/heartbeatReceiver`,
              body: activePlayerName,
            });
          }, 3000);
        }
      },
    });

    if (!heartbeatClientActivated) {
      setHeartbeatClientActivated(true);
      heartbeatClient.activate();
    }

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, []);
}
