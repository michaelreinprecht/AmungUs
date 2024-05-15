import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { PlayerInfo } from "../../../app/types";
import { calculateNearestVictim } from "../utilityFunctions/calculateNearestPlayer";
import { usePlayerMovement } from "./usePlayerMovement";
import { usePlayerHeartbeat } from "./usePlayerHeartbeat";
import { getPositionOfPlayer } from "../utilityFunctions/playerPositionHandler";

type usePlayerCharacterProps = {
  camera: THREE.Camera;
  isGamePaused: boolean;
  activePlayerName: string;
  activePlayerCharacter: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerInfo[];
  setPlayerPositions: (playerPositions: PlayerInfo[]) => void;
};

export function usePlayerCharacter({
  camera,
  isGamePaused,
  activePlayerName,
  activePlayerCharacter,
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
    activePlayerCharacter,
    scale,
    playerPositions,
    lobbyCode,
    meshRef,
    setPlayerPositions
  );

  usePlayerHeartbeat(lobbyCode, activePlayerName);

  //TODO: Remove after testing is done
  useEffect(() => {
    console.log("Use effect called in usePlayerCharacter");
  }, []);

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

  useEffect(() => {
    // Update camera position when active player's position changes
    const activePlayerPosition = getPositionOfPlayer(
      playerPositions,
      activePlayerName
    );
    if (activePlayerPosition) {
      camera.position.x = activePlayerPosition.playerPositionX;
      camera.position.y = activePlayerPosition.playerPositionY;
    }
  }, [playerPositions]);

  return { playerPositions, meshRef };
}
