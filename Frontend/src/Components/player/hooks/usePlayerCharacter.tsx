import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useStompClient, useSubscription } from "react-stomp-hooks";

export type PlayerPosition = {
  playerName: string;
  playerPositionX: number;
  playerPositionY: number;
  alive: boolean;
};



export function usePlayerCharacter(
  activePlayerName: string,
  scale: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  lobbyCode: string,
  onNearestPlayerChange: (playerName: string) => void // New property
) {
  const stompClient = useStompClient();
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([
    {
      playerName: activePlayerName,
      playerPositionX: (Math.random() - 0.5) * 20,
      playerPositionY: (Math.random() - 0.5) * 20,
      alive: true,
    },
  ]);

  

  const colorMap = useLoader(TextureLoader, "/rick.png");
  const meshRef = useRef<THREE.Mesh>(null);

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    // Calculate nearest player and call onNearestPlayerChange when it changes
    const nearestPlayer = calculateNearestPlayer(playerPositions);
    if (nearestPlayer !== null) {
      onNearestPlayerChange(nearestPlayer);
    }
  }, [playerPositions]);

  

  useEffect(() => {
    //Initial position update of the player
    updatePlayerPosition(playerPositions[0]);

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setMovement((prevMovement) => ({ ...prevMovement, forward: true }));
          break;
        case "s":
          setMovement((prevMovement) => ({ ...prevMovement, backward: true }));
          break;
        case "a":
          setMovement((prevMovement) => ({ ...prevMovement, left: true }));
          break;
        case "d":
          setMovement((prevMovement) => ({ ...prevMovement, right: true }));
          break;
        default:
          break;
      }
    };

  

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setMovement((prevMovement) => ({ ...prevMovement, forward: false }));
          break;
        case "s":
          setMovement((prevMovement) => ({ ...prevMovement, backward: false }));
          break;
        case "a":
          setMovement((prevMovement) => ({ ...prevMovement, left: false }));
          break;
        case "d":
          setMovement((prevMovement) => ({ ...prevMovement, right: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const speed = 30 * delta;
      const { forward, backward, left, right } = movement;

      const playerPosition = playerPositions.find(
        (pos) => pos.playerName === activePlayerName
      );

      if (playerPosition) {
        let newPositionX = playerPosition.playerPositionX;
        let newPositionY = playerPosition.playerPositionY;

        if (forward || backward || left || right) {
          if (forward) newPositionY += speed;
          if (backward) newPositionY -= speed;
          if (left) newPositionX -= speed;
          if (right) {
            newPositionX += speed;
          }

          // Update position based on bounds
          if (
            newPositionX - scale / 2 >= bounds.minX &&
            newPositionX + scale / 2 <= bounds.maxX &&
            newPositionY - scale / 2 >= bounds.minY &&
            newPositionY + scale / 2 <= bounds.maxY
          ) {
            const updatedPlayerPosition = {
              playerName: activePlayerName,
              playerPositionX: newPositionX,
              playerPositionY: newPositionY,
              alive: playerPosition.alive,
            };

            updatePlayerPosition(updatedPlayerPosition);
          }
        }
      } else {
        console.log("Unable to find player position for given name");
      }
    }
  });

  function updatePlayerPosition(playerPos: any) {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${lobbyCode}/playerInfoReceiver`,
        body: JSON.stringify(playerPos),
      });
    }
  }

  // Helper function to calculate the nearest player
const calculateNearestPlayer = (playerPositions: PlayerPosition[]) => {
  const currentPlayerPosition = playerPositions.find(
    (pos) => pos.playerName === activePlayerName
  );

  if (!currentPlayerPosition) return null;

  let nearestPlayer: string | null = null;
  let nearestDistanceSquared = Infinity;

  for (const pos of playerPositions) {
    if (pos.playerName !== activePlayerName) {
      const distanceSquared =
        Math.pow(pos.playerPositionX - currentPlayerPosition.playerPositionX, 2) +
        Math.pow(pos.playerPositionY - currentPlayerPosition.playerPositionY, 2);

      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
        nearestPlayer = pos.playerName;
      }
    }
  }

  return nearestPlayer;
};

function killPlayer(playerName: string) {
  setPlayerPositions((prevPositions) =>
    prevPositions.map((pos) =>
      pos.playerName === playerName ? { ...pos, alive: false } : pos
    )
  );
}

  

  useSubscription(`/lobby/${lobbyCode}/playerInfo`, (message) => {
    const parsedMessage = JSON.parse(message.body);
    setPlayerPositions(parsedMessage);
  });

  return { playerPositions, meshRef, colorMap, killPlayer };
}
