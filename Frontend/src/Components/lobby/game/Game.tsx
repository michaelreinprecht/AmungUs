import React, { useEffect, useRef } from "react";
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
import { Task, TaskObjectData } from "@/app/types";

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
  } = useGame(activePlayerName, lobbyCode);

  const currentPlayerInfo = getPositionOfPlayer(
    playerPositions,
    activePlayerName
  );
  const scale = 5;

  const taskObjects: TaskObjectData[] = [
    {
      task: currentPlayerTasks[0],
      position: [150, 48, 0],
      taskObjectImage: currentPlayerTasks[0]
        ? currentPlayerTasks[0].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
    {
      task: currentPlayerTasks[1],
      position: [178, -62, 0],
      taskObjectImage: currentPlayerTasks[2]
        ? currentPlayerTasks[2].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
    {
      task: currentPlayerTasks[2],
      position: [177, -88, 0],
      taskObjectImage: currentPlayerTasks[2]
        ? currentPlayerTasks[2].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
    {
      task: currentPlayerTasks[3],
      position: [-12, -130, 0],
      taskObjectImage: currentPlayerTasks[3]
        ? currentPlayerTasks[3].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
    {
      task: currentPlayerTasks[4],
      position: [-122, -46, 0],
      taskObjectImage: currentPlayerTasks[4]
        ? currentPlayerTasks[4].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
    {
      task: currentPlayerTasks[5],
      position: [-188, 113, 0],
      taskObjectImage: currentPlayerTasks[5]
        ? currentPlayerTasks[5].completed
          ? "/TaskObjectCompleted.png"
          : "/TaskObject.png"
        : "/TaskObject.png",
    },
  ];

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
        <TaskList
          currentPlayerTasks={currentPlayerTasks}
          allPlayerTasks={allPlayerTasks}
        />
      </div>

      {/* Display current lobby code */}
      <LobbyCodeUI lobbyCode={lobbyCode} />
    </div>
  );
}
