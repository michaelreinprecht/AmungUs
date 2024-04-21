import { getPositionOfCurrentPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { sendKillRequest } from "@/Components/utilityFunctions/webSocketHandler";
import { PlayerPosition } from "@/app/types";
import React from "react";
import { Client } from "react-stomp-hooks";

type KillUIProps = {
  activePlayerName: string;
  victimName: string;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
  stompClient: Client | undefined;
  lobbyCode: string;
};

export default function KillUI({
  activePlayerName,
  victimName,
  stompClient,
  lobbyCode,
}: KillUIProps) {
  const handleKill = () => {
    console.log("Kill button clicked");
    console.log("Kill initiated by: " + activePlayerName);
    console.log("Attempting to kill: " + victimName);
    sendKillRequest(activePlayerName, victimName, stompClient, lobbyCode);

    /*
    const newPlayerPositions = playerPositions.map((player) =>
      player.playerName === nearestPlayer ? { ...player, alive: false } : player
    );

    console.log(newPlayerPositions);
    setPlayerPositions(newPlayerPositions);
    const nearestPlayerPos = newPlayerPositions.filter(
      (player) => player.playerName === nearestPlayer
    )[0];
    nearestPlayerPos.alive = false;
    updatePlayerPosition(nearestPlayerPos, stompClient, lobbyCode);
    */
  };

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
      <img
        src="/KillUI.png"
        alt="UI Element"
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
}
