import React from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, NearestFilter } from "three";
import { Text } from "@react-three/drei";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { PlayerInfo } from "../../app/types";
import { getPositionOfPlayer } from "./utilityFunctions/playerPositionHandler";

interface PlayerCharacterProps {
  isGamePaused: boolean;
  isGameOver: boolean;
  isGameStarted: boolean;
  activePlayerName: string;
  activePlayerCharacter: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerInfo[];
  setPlayerPositions: (playerPositions: PlayerInfo[]) => void;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  isGamePaused,
  isGameOver,
  isGameStarted,
  activePlayerName,
  activePlayerCharacter,
  scale,
  lobbyCode,
  onNearestPlayerChange,
  playerPositions,
  setPlayerPositions,
}) => {
  const camera = useThree((state) => state.camera);

  const { meshRef } = usePlayerCharacter({
    camera,
    isGamePaused,
    isGameOver,
    isGameStarted,
    activePlayerName,
    activePlayerCharacter,
    scale,
    lobbyCode,
    onNearestPlayerChange,
    playerPositions,
    setPlayerPositions,
  });

  const loadTexture = (path: string) => {
    const texture = useLoader(TextureLoader, path);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.generateMipmaps = false;
    return texture;
  };

  const textureMap: { [key: string]: any } = {
    "character-1": loadTexture("/character-1-move-1.png"),
    "character-2": loadTexture("/character-2-move-1.png"),
    "character-3": loadTexture("/character-3-move-1.png"),
    "character-4": loadTexture("/character-4-move-1.png"),
    "character-5": loadTexture("/character-5-move-1.png"),
    "character-6": loadTexture("/character-6-move-1.png"),
    "character-7": loadTexture("/character-7-move-1.png"),
    "character-8": loadTexture("/character-8-move-1.png"),
    "character-9": loadTexture("/character-9-move-1.png"),
    "character-10": loadTexture("/character-10-move-1.png"),
    ghost: loadTexture("/ghost.png"),
  };

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
              <planeGeometry args={[1.5 * scale, 1.5 * scale]} />
              <meshStandardMaterial
                map={
                  pos.alive
                    ? textureMap[pos.playerCharacter]
                    : textureMap["ghost"]
                }
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
