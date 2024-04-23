import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { PlayerPosition } from "../../../app/types";
import { calculateNearestVictim } from "../utilityFunctions/calculateNearestPlayer";
import { usePlayerMovement } from "./usePlayerMovement";
import { usePlayerHeartbeat } from "./usePlayerHeartbeat";

type usePlayerCharacterProps = {
  isGamePaused: boolean;
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
};

export function usePlayerCharacter({
  isGamePaused,
  activePlayerName,
  scale,
  lobbyCode,
  onNearestPlayerChange,
  playerPositions,
  setPlayerPositions,
}: usePlayerCharacterProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  usePlayerMovement(
    isGamePaused,
    activePlayerName,
    scale,
    playerPositions,
    lobbyCode,
    meshRef,
    setPlayerPositions
  );

  usePlayerHeartbeat(lobbyCode, activePlayerName);

  useEffect(() => {
    // Calculate nearest player and call onNearestPlayerChange once playerPositions change
    const nearestPlayer = calculateNearestVictim(
      playerPositions,
      activePlayerName
    );
    if (nearestPlayer !== null) {
      onNearestPlayerChange(nearestPlayer);
    }
  }, [playerPositions]);

  return { playerPositions, meshRef };
}
