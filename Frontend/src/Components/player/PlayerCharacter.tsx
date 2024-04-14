import React from "react";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { Text } from "@react-three/drei";
import { PlayerPosition } from "./types";

interface PlayerCharacterProps {
  activePlayerName: string;
  scale: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;

}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  activePlayerName,
  scale,
  bounds,
  lobbyCode,
  onNearestPlayerChange,
  playerPositions,
  setPlayerPositions
}) => {
  const {  meshRef, colorMap } = usePlayerCharacter(
    {activePlayerName, scale, bounds, lobbyCode, onNearestPlayerChange, playerPositions, setPlayerPositions}
  );

  return (
    <>
      {playerPositions.map((pos) => (
        <group
          key={pos.playerName}
          position={[pos.playerPositionX, pos.playerPositionY, 0]}
        >
          <mesh ref={activePlayerName === pos.playerName ? meshRef : null}>
            <planeGeometry args={[2 * scale, 2 * scale]} />
            <meshStandardMaterial map={colorMap} transparent={true} />
          </mesh>
          <Text
            position={[0, scale, 0]}
            fontSize={0.6 * scale}
            color="orange"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01 * scale}
            outlineColor="#000000"
          >
            {pos.playerName}
          </Text>
        </group>
      ))}
    </>
  );
};

export default PlayerCharacter;
