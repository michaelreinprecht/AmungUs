import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { PlayerPosition } from "../../../app/types";
import { calculateNearestPlayer } from "../utilityFunctions/calculateNearestPlayer";
import { usePlayerMovement } from "./usePlayerMovement";
import { usePlayerHeartbeat } from "./usePlayerHeartbeat";

type usePlayerCharacterProps = {
  activePlayerName: string;
  scale: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
};

export function usePlayerCharacter({
  activePlayerName,
  scale,
  bounds,
  lobbyCode,
  onNearestPlayerChange,
  playerPositions,
  setPlayerPositions,
}: usePlayerCharacterProps) {
  const colorMap = useLoader(TextureLoader, "/rick.png");
  const meshRef = useRef<THREE.Mesh>(null);

  usePlayerMovement(
    activePlayerName,
    scale,
    bounds,
    playerPositions,
    lobbyCode,
    meshRef,
    setPlayerPositions
  );

  usePlayerHeartbeat(lobbyCode, activePlayerName);

  useEffect(() => {
    // Calculate nearest player and call onNearestPlayerChange once playerPositions change
    const nearestPlayer = calculateNearestPlayer(playerPositions, activePlayerName);
    if (nearestPlayer !== null) {
      onNearestPlayerChange(nearestPlayer);
    }
  }, [playerPositions]);

  return { playerPositions, meshRef, colorMap };
}
