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
    playerRole: Math.random() < 0.5 ? "killer" : "crewmate",}]);

  const stompClient = useStompClient();

  // Bounds that match the background
  const bounds = {
    minX: -50, // Minimum x-coordinate
    maxX: 50, // Maximum x-coordinate
    minY: -35, // Minimum y-coordinate
    maxY: 35, // Maximum y-coordinate
  };

  const handleKill = () => {
    console.log("Kill button clicked");
    console.log(nearestPlayer);
    const newPlayerPositions = playerPositions.map((player) =>
      player.playerName === nearestPlayer
        ? { ...player, alive: false }
        : player
    );

    console.log(newPlayerPositions);
    setPlayerPositions(newPlayerPositions);
    const nearestPlayerPos = newPlayerPositions.filter(player => player.playerName === nearestPlayer)[0];
    nearestPlayerPos.alive = false;
    updatePlayerPosition(nearestPlayerPos);
  }

  function updatePlayerPosition(playerPos: PlayerPosition) {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${lobbyCode}/playerInfoReceiver`,
        body: JSON.stringify(playerPos),
      });
    }
  }
  

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
          bounds={bounds}
          lobbyCode={lobbyCode}
          onNearestPlayerChange={(playerName: string) =>
            setNearestPlayer(playerName)
          }
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
        />
         
      </Canvas>
      
       
      {/* Kill UI */}
      {playerPositions.find(player => player.playerName === activePlayerName && player.playerRole === "killer") && <KillUI onClick={handleKill} />}
      
    </div>
  );
}
