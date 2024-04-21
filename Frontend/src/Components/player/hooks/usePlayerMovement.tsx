import { Movement, PlayerPosition } from "@/app/types";
import { useEffect, useState } from "react";
import {
  createKeyDownHandler,
  createKeyUpHandler,
} from "../utilityFunctions/keyEventHandler";
import {
  getPositionPlayer,
  getUpdatedPlayerPosition,
  setPlayerSpawnInfo,
} from "../utilityFunctions/playerPositionHandler";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { updatePlayerPosition } from "@/Components/utilityFunctions/webSocketHandler";

export function usePlayerMovement(
  activePlayerName: string,
  scale: number,
  playerPositions: PlayerPosition[],
  lobbyCode: string,
  meshRef: React.RefObject<
    THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >,
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void
) {
  const stompClient = useStompClient();

  const [movement, setMovement] = useState<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Bounds that match the background
  const bounds = {
    minX: -50, // Minimum x-coordinate
    maxX: 50, // Maximum x-coordinate
    minY: -35, // Minimum y-coordinate
    maxY: 35, // Maximum y-coordinate
  };

  useEffect(() => {
    (async () => {
      await setPlayerSpawnInfo(setPlayerPositions, activePlayerName, lobbyCode);
      //Initial position update of the player
      updatePlayerPosition(
        getPositionPlayer(playerPositions, activePlayerName),
        stompClient,
        lobbyCode
      );
    })();
    /*
    setPlayerSpawnInfo(setPlayerPositions, activePlayerName, lobbyCode);
    //Initial position update of the player
    updatePlayerPosition(
      getPositionPlayer(playerPositions, activePlayerName),
      stompClient,
      lobbyCode
    );*/

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
      if (
        movement.forward ||
        movement.backward ||
        movement.left ||
        movement.right
      ) {
        updatePlayerPosition(
          getUpdatedPlayerPosition(
            delta,
            activePlayerName,
            movement,
            bounds,
            scale,
            playerPositions
          ),
          stompClient,
          lobbyCode
        );
      }
    }
  });

  /*
  useEffect(() => {
    setPlayerSpawnPosition(setPlayerPositions, activePlayerName);
  }, [activePlayerName, setPlayerPositions]);
  */

  useSubscription(`/lobby/${lobbyCode}/playerInfo`, (message) => {
    const parsedMessage = JSON.parse(message.body);
    setPlayerPositions(parsedMessage);
  });

  return {};
}
