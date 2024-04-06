import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { Text } from "@react-three/drei";

interface PlayerCharacterProps {
  activePlayerName: string;
  scale: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export type PlayerPosition = {
  playerName: string;
  playerPositionX: number;
  playerPositionY: number;
};

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  activePlayerName,
  scale,
  bounds,
}) => {
  const stompClient = useStompClient();
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([
    {
      playerName: activePlayerName,
      playerPositionX: 0,
      playerPositionY: 0,
    },
  ]);

  const colorMap = useLoader(TextureLoader, "rick.png");
  const meshRef = useRef<THREE.Mesh>(null);

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
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
        let newPositionX = playerPosition.playerPositionX; // Assuming there's only one player
        let newPositionY = playerPosition.playerPositionY; // Assuming there's only one player

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
            };

            //TODO: Update in front end and get ok from backend
            //setPlayerPositions([updatedPlayerPosition]);
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
        destination: "/app/playerPositionReceiver",
        body: JSON.stringify(playerPos),
      });
    }
  }

  useSubscription("/chat/positions", (message) => {
    const parsedMessage = JSON.parse(message.body).playerPositions;
    setPlayerPositions(parsedMessage);
  });

  return (
    <>
      {playerPositions.map((pos) => (
        <group
          key={pos.playerName}
          position={[pos.playerPositionX, pos.playerPositionY, 0]}
        >
          <mesh ref={activePlayerName === pos.playerName ? meshRef : null}>
            <planeGeometry args={[2 * scale, 2 * scale]} />
            <meshStandardMaterial map={colorMap} transparent={true} />
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
