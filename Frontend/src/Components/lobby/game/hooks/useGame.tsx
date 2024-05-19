import { useEffect, useState } from "react";
import { getPositionOfPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { killCooldown, killRange } from "@/app/globals";
import getDistanceBetween from "@/Components/utilityFunctions/getDistanceBetween";
import { GameOverInfo, PlayerInfo, Task } from "@/app/types";
import { Client } from "@stomp/stompjs";
import { parse } from "path";

export function useGame(activePlayerName: string, lobbyCode: string) {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerInfo[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task>({ id: 0, name: "", completed: false });
  const [votingKill, setVotingKill] = useState<string>("");
  const [winners, setWinners] = useState<GameOverInfo>({
    winner: "",
    teamMembers: [],
  });
  const possibleTasks = [    
    {  id: 1, name: "ColorTask", completed: false },
    {  id: 2, name: "MemoryTask", completed: false },
    {  id: 3, name: "ReactionTask", completed: false },
    {  id: 4, name: "FindTask", completed: false }]

  const [currentPlayerTasks, setCurrentPlayerTasks] = useState<Task[]>([]);

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

    const lobbyClient = new Client({
      brokerURL: "ws://localhost:8080/lobbyService",
      onConnect: () => {
        lobbyClient.subscribe(
          `/lobby/${lobbyCode}/gameOver`,
          (message: any) => {
            const parsedWinners = JSON.parse(message.body) as GameOverInfo;
            if (message.body.winner !== "") {
              setWinners(parsedWinners);
            }
          }
        );
      },
    });
    lobbyClient.activate();
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
      const lastKillTimeString = killer.lastKillTime;
      const lastKillTime = new Date(lastKillTimeString);
      const timeSinceLastKill =
        (new Date().getTime() - lastKillTime.getTime()) / 1000;
      if (timeSinceLastKill >= killCooldown) {
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

  function getRandomTask(tasks: Task[]) {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  }

  useEffect(() => {
    const initialTasks = [];
    for (let i = 0; i < 6; i++) {
      let randomTask = getRandomTask(possibleTasks);
      // Ensure the task is unique by creating a deep copy
      randomTask = JSON.parse(JSON.stringify(randomTask));
      // Assigning the id to match the index
      randomTask.id = i; // Adding 1 to avoid id starting from 0
      initialTasks.push(randomTask);
    }
    setCurrentPlayerTasks(initialTasks);
  }, []);
  
  
  

  return {
    votingKill,
    isGamePaused,
    setIsGamePaused,
    nearestPlayer,
    setNearestPlayer,
    playerPositions,
    setPlayerPositions,
    isVotingActive,
    isKillEnabled,
    isKillUIVisible,
    currentTask,
    setCurrentTask,
    currentPlayerTasks,
    setCurrentPlayerTasks,
    winners,
    setWinners,
  };
}
