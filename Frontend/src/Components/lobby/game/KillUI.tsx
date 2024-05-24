import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { serverAddress } from "@/app/globals";

type KillUIProps = {
  isKillEnabled: boolean | undefined;
  activePlayerName: string;
  victimName: string;
  lobbyCode: string;
};

export default function KillUI({
  isKillEnabled,
  activePlayerName,
  victimName,
  lobbyCode,
}: KillUIProps) {
  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();

  function handleKill() {
    if (isKillEnabled) {
      const requestBody = {
        killerName: activePlayerName,
        victimName: victimName,
      };
      lobbyClient?.publish({
        destination: `/app/${lobbyCode}/killReceiver`,
        body: JSON.stringify(requestBody),
      });
    }
  }

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${serverAddress}:8080/lobbyService`,
    });
    client.activate();
    setLobbyClient(client);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        cursor: isKillEnabled ? "pointer" : "not-allowed",
      }}
      onClick={handleKill}
    >
      <img
        src="/KillUI.png"
        alt="UI Element"
        style={{
          width: 100,
          height: 100,
          opacity: isKillEnabled ? 1 : 0.5, // Lower opacity if killing is disabled
        }}
      />
    </div>
  );
}
