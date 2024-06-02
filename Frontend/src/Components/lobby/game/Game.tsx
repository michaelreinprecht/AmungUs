import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import PlayerCharacter from "../../player/PlayerCharacter";
import KillUI from "./KillUI";
import PlayerCorpse from "@/Components/player/PlayerCorpse";
import VotingUI from "./VotingUI";
import ChatWindow from "../chat/ChatWindow";
import { useGame } from "./hooks/useGame";
import { usePlayerMovement } from "@/Components/player/hooks/usePlayerMovement";
import EmergencyButton from "./EmergencyButton";
import TaskObject from "@/Components/task/TaskObject";
import ColorTask from "@/Components/task/ColorTask";
import Colliders from "./Colliders";
import MemoryTask from "@/Components/task/MemoryTask";
import ReactionTask from "@/Components/task/ReactionTask";
import FindTask from "@/Components/task/FindTask";
import VotingKillUI from "./VotingKillUI";
import GameOverUI from "./GameOverUI";
import TaskList from "@/Components/task/TaskList";
import LobbyCodeUI from "./LobbyCodeUI";
import StartGameUI from "./StartGameUI";
import { getPositionOfPlayer } from "@/Components/player/utilityFunctions/playerPositionHandler";
import MapUI from "./MapUI";
import { Task, TaskObjectData, TaskObjectDisplayData } from "@/app/types";
import { TrackballControls } from "three/examples/jsm/Addons.js";

type GameProps = {
  activePlayerName: string;
  activePlayerCharacter: string;
  lobbyCode: string;
  isGameStarted: boolean;
};

export default function Game({
  activePlayerName,
  activePlayerCharacter,
  lobbyCode,
  isGameStarted,
}: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
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
  } = useGame(activePlayerName, lobbyCode);

  const currentPlayerInfo = getPositionOfPlayer(
    playerPositions,
    activePlayerName
  );
  const scale = 5;
  const [taskObjects, setTaskObjects] = useState<TaskObjectData[]>([]);
  const [taskPositions, setTaskPositions] = useState<TaskObjectDisplayData[]>(
    []
  );

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  useEffect(() => {
    const fixedTaskPositions: TaskObjectDisplayData[] = [
      {
        position: [150, 48, 0],
        taskObjectImage: "/BowTask.png",
        taskObjectCompletedImage: "/TaskObjectCompleted.png",
      },
      {
        position: [178, -62, 0],
        taskObjectImage: "/ChaliceTask.png",
        taskObjectCompletedImage: "/ChaliceTaskCompleted.png",
      },
      {
        position: [177, -88, 0],
        taskObjectImage: "/KeyTask.png",
        taskObjectCompletedImage: "/KeyTaskCompleted.png",
      },
      {
        position: [-12, -130, 0],
        taskObjectImage: "/ShieldTask.png",
        taskObjectCompletedImage: "/ShieldTaskCompleted.png",
      },
      {
        position: [-122, -46, 0],
        taskObjectImage: "/BowTask.png",
        taskObjectCompletedImage: "/BowTaskCompleted.png",
      },
      {
        position: [-188, 113, 0],
        taskObjectImage: "/ChaliceTask.png",
        taskObjectCompletedImage: "/ChaliceTaskCompleted.png",
      },
      {
        position: [1, 20, 0],
        taskObjectImage: "/KeyTask.png",
        taskObjectCompletedImage: "/KeyTaskCompleted.png",
      },
      {
        position: [-31, 127, 0],
        taskObjectImage: "/ShieldTask.png",
        taskObjectCompletedImage: "/ShieldTaskCompleted.png",
      },
    ];
    shuffleArray(fixedTaskPositions);
    setTaskPositions(fixedTaskPositions);
  }, []);

  useEffect(() => {
    if (taskPositions == undefined) return;
    const newTaskObjects: TaskObjectData[] = [];

    taskPositions.forEach((displayData, index) => {
      if (currentPlayerTasks.length == 0) return;
      newTaskObjects.push({
        task: currentPlayerTasks[index],
        position: displayData.position,
        taskObjectImage: currentPlayerTasks[index]
          ? currentPlayerTasks[index].completed
            ? displayData.taskObjectCompletedImage
            : displayData.taskObjectImage
          : displayData.taskObjectCompletedImage,
      });
    });
    setTaskObjects(newTaskObjects);
  }, [currentPlayerTasks, setCurrentPlayerTasks]);

  return (
    <div ref={canvasRef} className="w-screen h-screen relative">
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 16,
          near: 0.1,
          far: 64,
          aspect: canvasRef.current
            ? canvasRef.current.clientWidth / canvasRef.current.clientHeight
            : undefined,
        }}
        orthographic
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <color attach="background" args={["#000000"]} />
        {/* Ambient light and directional light */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />

        {/* Background component with overlay image */}
        <Background textureUrl="/AmungUsMap.png" />

        {/* Render player character */}
        <PlayerCharacter
          isGamePaused={isGamePaused}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
          activePlayerName={activePlayerName}
          activePlayerCharacter={activePlayerCharacter}
          scale={scale}
          lobbyCode={lobbyCode}
          onNearestPlayerChange={(playerName: string) =>
            setNearestPlayer(playerName)
          }
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
        />

        <EmergencyButton
          position={{ x: 26, y: 74, z: 0 }}
          texturePath="/EmergencyButton.png"
          label=""
          scale={scale}
          isGamePaused={false}
          activePlayerName={activePlayerName}
          lobbyCode={lobbyCode}
        />

        {/* Render player corpse */}
        <PlayerCorpse
          activePlayerName={activePlayerName}
          scale={scale}
          lobbyCode={lobbyCode}
          playerPositions={playerPositions}
        />

        {/* Render task objects */}
        {taskObjects.map(({ task, position, taskObjectImage }, index) => (
          <TaskObject
            key={index}
            position={position}
            scale={scale}
            task={task}
            setCurrentTask={setCurrentTask}
            taskObjectImage={taskObjectImage}
          />
        ))}
      </Canvas>

      {/* Kill UI */}
      {isKillUIVisible() && !isVotingActive && (
        <KillUI
          isKillEnabled={isKillEnabled()}
          activePlayerName={activePlayerName}
          victimName={nearestPlayer}
          lobbyCode={lobbyCode}
        />
      )}

      {/* Voting UI */}
      {isVotingActive && (
        <VotingUI
          lobbyCode={lobbyCode}
          activePlayerName={activePlayerName}
          activePlayerCharacter={activePlayerCharacter}
        />
      )}

      {/* Render MessageForm and MessageList only if connected */}
      {isVotingActive && (
        <ChatWindow activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
      )}

      {/* Tasks */}
      {currentTask.name === "ColorTask" && (
        <ColorTask
          setCurrentTask={setCurrentTask}
          setCurrentPlayerTasks={setCurrentPlayerTasks}
          currentTask={currentTask}
          updateTask={updateTask}
        />
      )}
      {currentTask.name === "MemoryTask" && (
        <MemoryTask
          setCurrentTask={setCurrentTask}
          setCurrentPlayerTasks={setCurrentPlayerTasks}
          currentTask={currentTask}
          updateTask={updateTask}
        />
      )}
      {currentTask.name === "ReactionTask" && (
        <ReactionTask
          setCurrentTask={setCurrentTask}
          setCurrentPlayerTasks={setCurrentPlayerTasks}
          currentTask={currentTask}
          updateTask={updateTask}
        />
      )}
      {currentTask.name === "FindTask" && (
        <FindTask
          setCurrentTask={setCurrentTask}
          setCurrentPlayerTasks={setCurrentPlayerTasks}
          currentTask={currentTask}
          updateTask={updateTask}
        />
      )}

      <VotingKillUI votingKill={votingKill} />

      {/* StartGameUI - only visible when game isn't started yet */}
      <StartGameUI
        currentPlayer={currentPlayerInfo}
        lobbyCode={lobbyCode}
        isGameStarted={isGameStarted}
      />

      <MapUI
        currentPlayerInfo={currentPlayerInfo}
        currentPlayerCharacter={activePlayerCharacter}
        taskObjects={taskObjects}
      />

      <GameOverUI
        activePlayerCharacter={activePlayerCharacter}
        winners={winners}
        setWinners={setWinners}
        setIsGameOver={setIsGameOver}
      />

      {/* Task List UI */}
      <div className="task-list-ui absolute top-2 left-2 p-4 bg-gray-800 text-white">
        <TaskList currentPlayerTasks={currentPlayerTasks} allPlayerTasks={allPlayerTasks} allTasksDone={allTasksDone} playerPositions={playerPositions}/>
      </div>

      {/* Display current lobby code */}
      <LobbyCodeUI lobbyCode={lobbyCode} />
    </div>
  );
}
