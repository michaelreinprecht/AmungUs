import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Background from "./Background";
import PlayerCharacter from "../../player/PlayerCharacter";
import KillUI from "./KillUI";
import { PlayerPosition } from "../../../app/types";
import { useStompClient } from "react-stomp-hooks";

type GameProps = {
  activePlayerName: string;
  lobbyCode: string;
};

export default function Game({ activePlayerName, lobbyCode }: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nearestPlayer, setNearestPlayer] = useState<string>("");
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([
    {
      playerName: activePlayerName,
      playerPositionX: (Math.random() - 0.5) * 20,
      playerPositionY: (Math.random() - 0.5) * 20,
      alive: true,
      playerRole: Math.random() < 0.5 ? "killer" : "crewmate",
    },
  ]);

  const stompClient = useStompClient();

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
          activePlayerName={activePlayerName}
          scale={5}
          lobbyCode={lobbyCode}
          onNearestPlayerChange={(playerName: string) =>
            setNearestPlayer(playerName)
          }
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
        />
      </Canvas>

      {/* Kill UI */}
      {playerPositions.find(
        (player) =>
          player.playerName === activePlayerName &&
          player.playerRole === "killer"
      ) && (
        <KillUI
          activePlayerName={activePlayerName}
          victimName={nearestPlayer}
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
          stompClient={stompClient}
          lobbyCode={lobbyCode}
        />
      )}
    </div>
  );
}
