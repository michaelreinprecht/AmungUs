import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { unsubscribe } from "diagnostics_channel";
import { PlayerPosition } from "../types";
import { createKeyDownHandler, createKeyUpHandler } from "../utilityFunctions/keyEventHandler";
import { getPositionOfCurrentPlayer, getUpdatedPlayerPosition } from "../utilityFunctions/playerPositionHandler";

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
    setPlayerPositions([
      {
        playerName: activePlayerName,
        playerPositionX: (Math.random() - 0.5) * 20,
        playerPositionY: (Math.random() - 0.5) * 20,
        alive: true,
        playerRole: Math.random() < 0.5 ? "killer" : "crewmate",
      },
    ]);

    //Initial position update of the player
    updatePlayerPosition(getPositionOfCurrentPlayer(playerPositions, activePlayerName));

    //Heartbeat to keep the connection alive
    const heartbeatIntervall = setInterval(() => {
      /*
      sendHeartbeat(lobbyCode);
      */
      //updatePlayerPosition(getPositionOfCurrentPlayer());
      sendHeartbeat(activePlayerName);
    }, 3000);

    const handleKeyDown = createKeyDownHandler(setMovement);
    const handleKeyUp = createKeyUpHandler(setMovement);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // Remove event listeners on component unmount
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      // Unsubscribe from websocket on component unmount
      if (stompClient) {
        stompClient.unsubscribe(`/lobby/${lobbyCode}/playerInfo`);
      }

      // Clear the heartbeat intervall
      clearInterval(heartbeatIntervall);
    };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (movement.forward || movement.backward || movement.left || movement.right) {
      updatePlayerPosition(getUpdatedPlayerPosition(delta, activePlayerName, movement, bounds, scale, playerPositions));
      }
      /*Start of logik I'm trying to repalce
      const speed = 30 * delta;
      const { forward, backward, left, right } = movement;

      const playerPosition = getPositionOfCurrentPlayer(playerPositions, activePlayerName);

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
              playerRole: playerPosition.playerRole,
            };

            updatePlayerPosition(updatedPlayerPosition);
          }
        }
      } else {
        console.log("Unable to find player position for given name");
      }
      //end of logic I'm trying to replace*/
    }
  });

  /*
  function getPositionOfCurrentPlayer() {
    const playerPosition = playerPositions.find(
      (pos) => pos.playerName === activePlayerName
    );
    return playerPosition;
  }*/

  function updatePlayerPosition(playerPos: any) {
    if (stompClient) {
      try {
        stompClient.publish({
          destination: `/app/${lobbyCode}/playerInfoReceiver`,
          body: JSON.stringify(playerPos),
        });
      } catch (error) {
        alert("Lost connection to server!");
      }
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
          Math.pow(
            pos.playerPositionX - currentPlayerPosition.playerPositionX,
            2
          ) +
          Math.pow(
            pos.playerPositionY - currentPlayerPosition.playerPositionY,
            2
          );

        if (distanceSquared < nearestDistanceSquared) {
          nearestDistanceSquared = distanceSquared;
          nearestPlayer = pos.playerName;
        }
      }
    }

    return nearestPlayer;
  };

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

  useSubscription(`/lobby/${lobbyCode}/playerInfo`, (message) => {
    const parsedMessage = JSON.parse(message.body);
    setPlayerPositions(parsedMessage);
  });

  return { playerPositions, meshRef, colorMap };
}
