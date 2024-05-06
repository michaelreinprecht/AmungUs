import { useEffect, useState } from "react";
import { getPositionOfPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import {
  emergencyButtonCooldown,
  killCooldown,
  killRange,
} from "@/app/globals";
import getDistanceBetween from "@/Components/utilityFunctions/getDistanceBetween";
import { PlayerPosition } from "@/app/types";
import { Client } from "@stomp/stompjs";

export function useGame(activePlayerName: string, lobbyCode: string) {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [votingKill, setVotingKill] = useState<String>("");
  const [isKillingOnCooldown, setIsKillingOnCooldown] =
    useState<boolean>(false); // State to store the timer
  const [isEmergencyButtonOnCooldown, setIsEmergencyButtonOnCooldown] =
    useState<boolean>(false); // State to store the timer
  let votingClientIsConnected = false;

  useEffect(() => {
    const votingClient = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        if (!votingClientIsConnected) {
          votingClientIsConnected = true;
          votingClient.subscribe(
            `/voting/${lobbyCode}/votingState`,
            (message) => {
              const votingActive = JSON.parse(message.body);

              setIsGamePaused(votingActive); //Pause or unpause the game
              setIsVotingActive(votingActive); //Display or stop displaying votingUI

              if (!votingActive) {
                // Add a little bit of kill cooldown once the game is unpaused.
                setIsKillingOnCooldown(true);
                setTimeout(() => {
                  setIsKillingOnCooldown(false);
                }, killCooldown * 1000);
                // Also add a cooldown to the emergency button before it can be pressed again
                setIsEmergencyButtonOnCooldown(true);
                setTimeout(() => {
                  setIsEmergencyButtonOnCooldown(false);
                }, emergencyButtonCooldown * 1000);
              }
            }
          );
          votingClient.subscribe(
            `/voting/${lobbyCode}/votingKill`,
            (message) => {
              setVotingKill(message.body);
              setTimeout(() => {
                setVotingKill("");
              }, 5000);
            }
          );
        }
      },
    });
    votingClient.activate();
  }, []);

  function isKillEnabled() {
    const killer = getPositionOfPlayer(playerPositions, activePlayerName);
    const victim = getPositionOfPlayer(playerPositions, nearestPlayer);
    if (killer && victim && killer.alive && victim.alive) {
      const distance = getDistanceBetween(
        killer.playerPositionX,
        killer.playerPositionY,
        victim.playerPositionX,
        victim.playerPositionY
      );
      if (!isKillingOnCooldown) {
        return distance <= killRange;
      } else {
        return false;
      }
    }
  }

  function isKillUIVisible() {
    return playerPositions.find(
      (player) =>
        player.playerName === activePlayerName && player.playerRole === "killer"
    );
  }

  return {
    votingKill,
    isGamePaused,
    nearestPlayer,
    setNearestPlayer,
    playerPositions,
    setPlayerPositions,
    isVotingActive,
    isKillEnabled,
    isKillUIVisible,
    currentTask,
    setCurrentTask,
    setIsKillingOnCooldown,
    isEmergencyButtonOnCooldown,
    setIsEmergencyButtonOnCooldown,
  };
}
