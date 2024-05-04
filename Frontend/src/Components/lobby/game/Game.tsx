import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import PlayerCharacter from "../../player/PlayerCharacter";
import KillUI from "./KillUI";
import PlayerCorpse from "@/Components/player/PlayerCorpse";
import VotingUI from "./VotingUI";
import ChatWindow from "../chat/ChatWindow";
import { useGame } from "./hooks/useGame";
import TaskObject from "@/Components/task/TaskObject";
import ColorTask from "@/Components/task/ColorTask";

type GameProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function Game({ activePlayerName, lobbyCode }: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
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
    setCurrentTask,    
  } = useGame(activePlayerName, lobbyCode);

  return (
    <div ref={canvasRef} className="w-screen h-screen">
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 10,
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
        {/* Ambient light and directional light */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />

        {/* Background component */}
        <Background textureUrl="/background.jpg" />

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
        <TaskObject position={[0, 25, 0]} scale={5} taskName="ColorTask" setCurrentTask={setCurrentTask} currentTask={currentTask}/>

      </Canvas>

      {/* Kill UI */}
      {isKillUIVisible() && (
        <KillUI
          isKillEnabled={isKillEnabled()}
          activePlayerName={activePlayerName}
          victimName={nearestPlayer}
          lobbyCode={lobbyCode}
        />
      )}

      {/* Voting UI */}
      {isVotingActive && <VotingUI lobbyCode={lobbyCode} />}

      {/* Render MessageForm and MessageList only if connected */}
      {isVotingActive && (
        <ChatWindow activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
      )}

      {/* Wire task */}
      {currentTask === "ColorTask" && <ColorTask setCurrentTask={setCurrentTask}/>}

    </div>
  );
}
