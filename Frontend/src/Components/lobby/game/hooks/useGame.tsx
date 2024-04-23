import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { getPositionPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { killRange } from "@/app/globals";
import getDistanceBetween from "@/Components/utilityFunctions/getDistanceBetween";
import { PlayerPosition } from "@/app/types";

export function useGame(activePlayerName: string, lobbyCode: string) {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);

  const stompClient = useStompClient();

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

  useSubscription(`/lobby/${lobbyCode}/isVoting`, (message) => {
    const parsedMessage = JSON.parse(message.body);
    setIsVotingActive(parsedMessage);
  });

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
    stompClient,
  };
}
