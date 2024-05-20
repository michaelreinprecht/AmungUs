import { Movement, PlayerInfo } from "@/app/types";
import { useEffect, useState } from "react";
import {
  createKeyDownHandler,
  createKeyUpHandler,
} from "../utilityFunctions/keyEventHandler";
import {
  getPlayerSpawnInfo,
  getUpdatedPlayerPosition,
} from "../utilityFunctions/playerPositionHandler";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Client } from "@stomp/stompjs";

export function usePlayerMovement(
  isGamePaused: boolean,
  isGameOver: boolean,
  isGameStarted: boolean,
  activePlayerName: string,
  activePlayerCharacter: string,
  scale: number,
  playerPositions: PlayerInfo[],
  lobbyCode: string,
  meshRef: React.RefObject<
    THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >,
  setPlayerPositions: (playerPositions: PlayerInfo[]) => void
) {
  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();
  let lobbyClientConnected = false;
  const [movement, setMovement] = useState<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Bounds that match the background
  const bounds = {
    minX: -236, // Minimum x-coordinate
    maxX: 236, // Maximum x-coordinate
    minY: -136, // Minimum y-coordinate
    maxY: 136, // Maximum y-coordinate
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/lobbyService",
      onConnect: () => {
        if (!lobbyClientConnected) {
          lobbyClientConnected = true;
          client?.subscribe(`/lobby/${lobbyCode}/playerInfo`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            setPlayerPositions(parsedMessage);
          });
          (async () => {
            //Initial position update of the player
            client?.publish({
              destination: `/app/${lobbyCode}/playerInfoReceiver`,
              body: JSON.stringify(
                await getPlayerSpawnInfo(
                  lobbyCode,
                  activePlayerName,
                  activePlayerCharacter
                )
              ),
            });
          })();
        }
      },
    });
    client.activate();
    setLobbyClient(client);

    const handleKeyDown = createKeyDownHandler(setMovement);
    const handleKeyUp = createKeyUpHandler(setMovement);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // Remove event listeners on component unmount
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      // Stop lobby client connection
      lobbyClientConnected = false;
      lobbyClient?.unsubscribe(`/lobby/${lobbyCode}/playerInfo`);
      lobbyClient?.deactivate();
    };
  }, []);

  useFrame((_, delta) => {
    if (!isGamePaused && !isGameOver && isGameStarted) {
      if (meshRef.current) {
        if (
          movement.forward ||
          movement.backward ||
          movement.left ||
          movement.right
        ) {
          //Initial position update of the player
          if (lobbyClient != undefined) {
            lobbyClient?.publish({
              destination: `/app/${lobbyCode}/playerInfoReceiver`,
              body: JSON.stringify(
                getUpdatedPlayerPosition(
                  delta,
                  activePlayerName,
                  movement,
                  bounds,
                  scale,
                  playerPositions
                )
              ),
            });
          }
        }
      }
    }
  });

  return {};
}
