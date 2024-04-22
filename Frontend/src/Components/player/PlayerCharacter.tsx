import React from "react";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { Text } from "@react-three/drei";
import { PlayerPosition } from "../../app/types";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

interface PlayerCharacterProps {
  isGamePaused: boolean;
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  isGamePaused,
  activePlayerName,
  scale,
  lobbyCode,
  onNearestPlayerChange,
  playerPositions,
  setPlayerPositions,
}) => {
  const { meshRef } = usePlayerCharacter({
    isGamePaused,
    activePlayerName,
    scale,
    lobbyCode,
    onNearestPlayerChange,
    playerPositions,
    setPlayerPositions,
  });
  const colorMapPlayer = useLoader(TextureLoader, "/rick.png");
  const colorMapGhost = useLoader(TextureLoader, "/ghost.png");

  return (
    <>
      {playerPositions
        .filter(
          (pos) =>
            pos.alive ||
            !playerPositions.find((p) => p.playerName === activePlayerName)
              ?.alive
        )
        .map((pos) => (
          <group
            key={pos.playerName}
            position={[pos.playerPositionX, pos.playerPositionY, 0]}
          >
            <mesh ref={activePlayerName === pos.playerName ? meshRef : null}>
              <planeGeometry args={[2 * scale, 2 * scale]} />
              <meshStandardMaterial
                map={pos.alive ? colorMapPlayer : colorMapGhost}
                transparent={true}
              />
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
