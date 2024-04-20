import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { PlayerPosition } from "../../../app/types";
import { calculateNearestPlayer } from "../utilityFunctions/calculateNearestPlayer";
import { usePlayerMovement } from "./usePlayerMovement";

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
  const stompClient = useStompClient();

  const colorMap = useLoader(TextureLoader, "/rick.png");
  const meshRef = useRef<THREE.Mesh>(null);

  const {} = usePlayerMovement(
    activePlayerName,
    scale,
    bounds,
    playerPositions,
    stompClient,
    lobbyCode,
    meshRef,
    setPlayerPositions
  );

  useEffect(() => {
    // Calculate nearest player and call onNearestPlayerChange once playerPositions change
    const nearestPlayer = calculateNearestPlayer(playerPositions, activePlayerName);
    if (nearestPlayer !== null) {
      onNearestPlayerChange(nearestPlayer);
    }
  }, [playerPositions]);

  useEffect(() => {
    //Heartbeat to keep the connection alive
    const heartbeatIntervall = setInterval(() => {
      sendHeartbeat(activePlayerName);
    }, 3000);

    return () => {
      // Clear the heartbeat intervall
      clearInterval(heartbeatIntervall);
    };
  }, []);

  function sendHeartbeat(playerName: string) {
    try {
      if (stompClient) {
        stompClient.publish({
          destination: `/app/${lobbyCode}/heartbeatReceiver`,
          body: playerName,
        });
      }
    } catch (error) {
      alert("Lost connection to server!");
    }
  }

  return { playerPositions, meshRef, colorMap };
}
