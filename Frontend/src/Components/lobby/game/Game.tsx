import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import PlayerCharacter from "../../player/PlayerCharacter";
import KillUI from "./KillUI";
import PlayerCorpse from "@/Components/player/PlayerCorpse";
import VotingUI from "./VotingUI";
import ChatWindow from "../chat/ChatWindow";
import { useGame } from "./hooks/useGame";
import EmergencyButton from "./EmergencyButton";
import TaskObject from "@/Components/task/TaskObject";
import ColorTask from "@/Components/task/ColorTask";
import Colliders from "./Colliders";

type GameProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function Game({ activePlayerName, lobbyCode }: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
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
    isEmergencyButtonOnCooldown,
  } = useGame(activePlayerName, lobbyCode);

  return (
    <div ref={canvasRef} className="w-screen h-screen">
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
          activePlayerName={activePlayerName}
          scale={5}
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
          scale={3}
          isGamePaused={false}
          activePlayerName={activePlayerName}
          lobbyCode={lobbyCode}
          isEmergencyButtonOnCooldown={isEmergencyButtonOnCooldown}
        />

        {/* Render player corpse */}
        <PlayerCorpse
          isGamePaused={isGamePaused}
          activePlayerName={activePlayerName}
          scale={5}
          lobbyCode={lobbyCode}
          onNearestPlayerChange={(playerName: string) =>
            setNearestPlayer(playerName)
          }
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
        />

        {/* Render task objects */}
        <TaskObject
          position={[0, 25, 0]}
          scale={5}
          taskName="ColorTask"
          setCurrentTask={setCurrentTask}
          currentTask={currentTask}
        />
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
        <VotingUI lobbyCode={lobbyCode} activePlayerName={activePlayerName} />
      )}

      {/* Render MessageForm and MessageList only if connected */}
      {isVotingActive && (
        <ChatWindow activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
      )}

      {/* Color task */}
      {currentTask === "ColorTask" && (
        <ColorTask setCurrentTask={setCurrentTask} />
      )}

      {votingKill !== "" && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-red-600 font-bold">
          Player {votingKill} was voted out!
        </div>
      )}
    </div>
  );
}
