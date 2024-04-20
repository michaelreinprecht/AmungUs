import { Movement, PlayerPosition } from "@/app/types";
import { useEffect, useState } from "react";
import { createKeyDownHandler, createKeyUpHandler } from "../utilityFunctions/keyEventHandler";
import { getPositionOfCurrentPlayer, getUpdatedPlayerPosition, setPlayerSpawnPosition } from "../utilityFunctions/playerPositionHandler";
import { Client, useStompClient, useSubscription } from "react-stomp-hooks";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function usePlayerMovement(
    activePlayerName: string,
    scale: number,
    bounds: { minX: number; maxX: number; minY: number; maxY: number },
    playerPositions: PlayerPosition[],
    lobbyCode: string,
    meshRef: React.RefObject<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>,
    setPlayerPositions: (playerPositions: PlayerPosition[]) => void
  ) {
    const stompClient = useStompClient();

    const [movement, setMovement] = useState<Movement>({
      forward: false,
      backward: false,
      left: false,
      right: false,
    });
  
    useEffect(() => {
      setPlayerSpawnPosition(setPlayerPositions, activePlayerName);
      //Initial position update of the player
      updatePlayerPosition(getPositionOfCurrentPlayer(playerPositions, activePlayerName));

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
      };
    }, []);

    useFrame((_, delta) => {
        if (meshRef.current) {
          if (movement.forward || movement.backward || movement.left || movement.right) {
          updatePlayerPosition(getUpdatedPlayerPosition(delta, activePlayerName, movement, bounds, scale, playerPositions));
          }
        }
      });
  
    useEffect(() => {
      setPlayerSpawnPosition(setPlayerPositions, activePlayerName);
    }, [activePlayerName, setPlayerPositions]);
  
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

      useSubscription(`/lobby/${lobbyCode}/playerInfo`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        setPlayerPositions(parsedMessage);
      });

    return {};
  }
  