import { useEffect, useState } from "react";
import { getPositionOfPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import { killCooldown, killRange, serverAddress } from "@/app/globals";
import getDistanceBetween from "@/Components/utilityFunctions/getDistanceBetween";
import { GameOverInfo, PlayerInfo, Task } from "@/app/types";
import { Client, IMessage } from "@stomp/stompjs";

export function useGame(activePlayerName: string, lobbyCode: string) {
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerInfo[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);
  const [sabotageInitiated, setSabotageInitiated] = useState<boolean>(false);
  const [sabotageCooldown, setSabotageCooldown] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: 0,
    name: "",
    completed: false,
    playerName: "",
    lobbyCode: "",
  });
  const [votingKill, setVotingKill] = useState<string>("");
  const [winners, setWinners] = useState<GameOverInfo>({
    winner: "",
    teamMembers: [],
  });
  const possibleTasks = [
    {
      id: 1,
      name: "ColorTask",
      completed: false,
      playerName: "",
      lobbyCode: "",
    },
    {
      id: 2,
      name: "MemoryTask",
      completed: false,
      playerName: "",
      lobbyCode: "",
    },
    {
      id: 3,
      name: "ReactionTask",
      completed: false,
      playerName: "",
      lobbyCode: "",
    },
    {
      id: 4,
      name: "FindTask",
      completed: false,
      playerName: "",
      lobbyCode: "",
    },
  ];
  const [currentPlayerTasks, setCurrentPlayerTasks] = useState<Task[]>([]);
  const [allPlayerTasks, setAllPlayerTasks] = useState<Task[]>([]);
  let votingClientIsConnected = false;
  let sabotagerunning = false;

  useEffect(() => {
    const votingClient = new Client({
      brokerURL: `ws://${serverAddress}:8081/votingService`,
      onConnect: () => {
        if (!votingClientIsConnected) {
          votingClientIsConnected = true;
          votingClient.subscribe(
            `/voting/${lobbyCode}/votingState`,
            (message) => {
              console.log("sabotägle", sabotageInitiated)
              if(!sabotagerunning) {
                const votingActive = JSON.parse(message.body);
                setIsGamePaused(votingActive); // Pause or unpause the game
                setIsVotingActive(votingActive); // Display or stop displaying votingUI
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

    const lobbyClient = new Client({
      brokerURL: `ws://${serverAddress}:8080/lobbyService`,
      onConnect: () => {
        lobbyClient.subscribe(
          `/lobby/${lobbyCode}/gameOver`,
          (message: IMessage) => {
            const parsedWinners = JSON.parse(message.body) as GameOverInfo;
            if (parsedWinners.winner !== "") {
              setWinners(parsedWinners);
            }
          }
        );
      },
    });
    lobbyClient.activate();

    const taskClient = new Client({
      brokerURL: `ws://${serverAddress}:8084/taskService`,
      onConnect: () => {
        console.log("Connected to taskService");
        // Subscribe to getTasks endpoint
        taskClient.subscribe(`/task/getTasks/${lobbyCode}`, (message) => {
          const tasks = JSON.parse(message.body) as Task[];
          console.log("Tasks received: ", tasks);
          setAllPlayerTasks(tasks);
        });        
        taskClient.subscribe(`/task/makeNewTasks/${lobbyCode}`, (message) => {
          console.log("henlo good sir");
          const initialTasks: Task[] = [];
          for (let i = 0; i < 6; i++) {
            let randomTask = getRandomTask(possibleTasks);
            // Ensure the task is unique by creating a deep copy
            randomTask = JSON.parse(JSON.stringify(randomTask));
            // Assigning the id to match the index
            randomTask.id = i;
            randomTask.playerName = activePlayerName;
            randomTask.lobbyCode = lobbyCode;
            // Check if the player is a killer
            const isActivePlayerKiller = playerPositions.some(
            (player) =>
              player.playerName === activePlayerName && player.playerRole === "killer"
            );
            // Send the task to the backend if the player is not a killer
            if(!isActivePlayerKiller){
              taskClient.publish({
                destination: `/taskApp/saveTasks/${lobbyCode}`,
                body: JSON.stringify(randomTask),
              });
            }
            initialTasks.push(randomTask);
          }
          setCurrentPlayerTasks(initialTasks);

        });
        // Create initial tasks and send them to the backend
        const initialTasks: Task[] = [];
        // Check if the player is a killer
        console.log("playerPositions: ", playerPositions);
        const isActivePlayerKiller = playerPositions.some(
          (player) =>
            player.playerName === activePlayerName && player.playerRole === "killer"
        );
        for (let i = 0; i < 6; i++) {
          let randomTask = getRandomTask(possibleTasks);
          // Ensure the task is unique by creating a deep copy
          randomTask = JSON.parse(JSON.stringify(randomTask));
          // Assigning the id to match the index
          randomTask.id = i;
          randomTask.playerName = activePlayerName;
          randomTask.lobbyCode = lobbyCode;
       
         // Send the task to the backend if the player is not a killer
          if(!isActivePlayerKiller){
            taskClient.publish({
              destination: `/taskApp/saveTasks/${lobbyCode}`,
              body: JSON.stringify(randomTask),
            });
          }
          initialTasks.push(randomTask);
        }
        setCurrentPlayerTasks(initialTasks);
      },
    });
    taskClient.activate();

    const sabotageClient = new Client({
      brokerURL: `ws://${serverAddress}:8085/sabotageService`,
      onConnect: () => {
        sabotageClient.subscribe(
          `/sabotage/sabotageInitiated/${lobbyCode}`, message => {
            const sabotageInitiated = JSON.parse(message.body);
            console.log("sabotageInitiated: ", sabotageInitiated);
            setSabotageInitiated(sabotageInitiated);
            sabotagerunning = sabotageInitiated;
            if(sabotageInitiated){
              setSabotageCooldown(90);
            }
          }
        )
        sabotageClient.subscribe(
          `/sabotage/sabotageCooldown/${lobbyCode}`, message => {
            setSabotageInitiated(false);
            setSabotageCooldown(0);
          }
        )
      },
    });
    sabotageClient.activate();

    // Clean up WebSocket connections on component unmount
    return () => {
      votingClient.deactivate();
      lobbyClient.deactivate();
      taskClient.deactivate();
      sabotageClient.deactivate();
    };
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
      const lastKillTime = new Date(killer.lastKillTime);
      const timeSinceLastKill =
        (new Date().getTime() - lastKillTime.getTime()) / 1000;
      return timeSinceLastKill >= killCooldown && distance <= killRange;
    }
    return false;
  }

  function isKillUIVisible() {
    return playerPositions.some(
      (player) =>
        player.playerName === activePlayerName && player.playerRole === "killer"
    );
  }

  function getRandomTask(tasks: Task[]) {
    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  }

  function updateTask(updatedTask: Task) {
    console.log("updateTask called with all player tasks: ", allPlayerTasks);
    const taskClient = new Client({
      brokerURL: `ws://${serverAddress}:8084/taskService`,
      onConnect: () => {
        taskClient.publish({
          destination: `/taskApp/completeTask/${lobbyCode}`,
          body: JSON.stringify(updatedTask),
        });
      },
    });
    taskClient.activate();
  }

  function allTasksDone() {
    console.log("allTasksDone called");
    const taskClient = new Client({
      brokerURL: `ws://${serverAddress}:8084/taskService`,
      onConnect: () => {
        taskClient.publish({
          destination: `/taskApp/allTasksDone/${lobbyCode}`,
          body: lobbyCode,
        });
      },
    })
    taskClient.activate();
  }

  return {
    votingKill,
    isGamePaused,
    isGameOver,
    setIsGameOver,
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
    updateTask,
    allPlayerTasks,
    allTasksDone,
    sabotageInitiated,
    setSabotageInitiated,
    sabotageCooldown,
    setSabotageCooldown,
  };
}
