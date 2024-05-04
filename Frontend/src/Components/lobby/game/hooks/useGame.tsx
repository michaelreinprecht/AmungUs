import { useEffect, useState } from "react";
import { getPositionPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { killRange } from "@/app/globals";
import getDistanceBetween from "@/Components/utilityFunctions/getDistanceBetween";
import { PlayerPosition } from "@/app/types";
import { Client } from "@stomp/stompjs";

export function useGame(activePlayerName: string, lobbyCode: string) {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>("");

  useEffect(() => {
    const votingClient = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        votingClient.subscribe(
          `/voting/${lobbyCode}/votingState`,
          (message) => {
            const votingActive = JSON.parse(message.body);
            setIsGamePaused(votingActive); //Pause or unpause the game
            setIsVotingActive(votingActive); //Display or stop displaying votingUI
          }
        );
      },
    });
    votingClient.activate();
  }, []);

  function isKillEnabled() {
    const killer = getPositionPlayer(playerPositions, activePlayerName);
    const victim = getPositionPlayer(playerPositions, nearestPlayer);
    if (killer && victim && killer.alive && victim.alive) {
      const distance = getDistanceBetween(
        killer.playerPositionX,
        killer.playerPositionY,
        victim.playerPositionX,
        victim.playerPositionY
      );
      return distance <= killRange;
    }
  }

  function isKillUIVisible() {
    return playerPositions.find(
      (player) =>
        player.playerName === activePlayerName && player.playerRole === "killer"
    );
  }


  return {
    isGamePaused,
    setIsGamePaused,
    nearestPlayer,
    setNearestPlayer,
    playerPositions,
    setPlayerPositions,
    isVotingActive,
    setIsVotingActive,
    isKillEnabled,
    isKillUIVisible,
    currentTask,
    setCurrentTask
  };
}
