import { updatePlayerPosition } from "@/Components/utilityFunctions/webSocketHandler";
import { PlayerPosition } from "@/app/types";
import React from "react";
import { Client } from "react-stomp-hooks";

type KillUIProps = {
  nearestPlayer: string;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
  stompClient: Client | undefined;
  lobbyCode: string;
};

export default function KillUI({ nearestPlayer, playerPositions, setPlayerPositions, stompClient, lobbyCode }: KillUIProps) {
  const handleKill = () => {
    console.log("Kill button clicked");
    console.log(nearestPlayer);
    const newPlayerPositions = playerPositions.map((player) =>
      player.playerName === nearestPlayer
        ? { ...player, alive: false }
        : player
    );

    console.log(newPlayerPositions);
    setPlayerPositions(newPlayerPositions);
    const nearestPlayerPos = newPlayerPositions.filter(player => player.playerName === nearestPlayer)[0];
    nearestPlayerPos.alive = false;
    updatePlayerPosition(nearestPlayerPos, stompClient, lobbyCode);
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        cursor: "pointer",
      }}
      onClick={handleKill}
    >
      <img src="/KillUI.png" alt="UI Element"
        style={{ width: 100, height: 100 }} />
    </div>
  );
};

