import { getPositionPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { sendKillRequest } from "@/Components/utilityFunctions/webSocketHandler";
import { PlayerPosition } from "@/app/types";
import React from "react";
import { Client } from "react-stomp-hooks";

type KillUIProps = {
  isKillEnabled: boolean | undefined;
  activePlayerName: string;
  victimName: string;
  stompClient: Client | undefined;
  lobbyCode: string;
};

export default function KillUI({
  isKillEnabled,
  activePlayerName,
  victimName,
  stompClient,
  lobbyCode,
}: KillUIProps) {
  const handleKill = () => {
    console.log("Kill button clicked");
    console.log("Kill initiated by: " + activePlayerName);
    console.log("Attempting to kill: " + victimName);
    if (isKillEnabled) {
      sendKillRequest(activePlayerName, victimName, stompClient, lobbyCode);
    }
  };

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
