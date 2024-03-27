import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useStompClient, useSubscription } from "react-stomp-hooks";

interface PlayerCharacterProps {
  scale: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ scale, bounds }) => {
  const stompClient = useStompClient();
  const [playerPositions, setPlayerPositions] = useState([
    { playerName: "Playername", playerPositionX: 0, playerPositionY: 0 },
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

  useFrame(() => {
    if (meshRef.current) {
      const speed = 0.5;
      const { forward, backward, left, right } = movement;

      let newPositionX = playerPositions[0].playerPositionX; // Assuming there's only one player
      let newPositionY = playerPositions[0].playerPositionY; // Assuming there's only one player

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
          playerName: "Playername",
          playerPositionX: newPositionX,
          playerPositionY: newPositionY,
        };

        //TODO: Update in front end and get ok from backend
        //setPlayerPositions([updatedPlayerPosition]);
        updatePlayerPosition(updatedPlayerPosition);
      }
    }
  });

  useSubscription("/chat/positions", (message) => {
    const parsedMessage = JSON.parse(message.body).playerPositions;
    if (Array.isArray(parsedMessage)) {
      setPlayerPositions(parsedMessage);
    } else {
      setPlayerPositions([parsedMessage]);
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

  return (
    <>
      {playerPositions.map((pos) => (
        <mesh
          ref={meshRef}
          key={pos.playerName}
          position={[pos.playerPositionX, pos.playerPositionY, 0]}
        >
          <planeGeometry args={[2 * scale, 2 * scale]} />
          <meshStandardMaterial map={colorMap} transparent={true} />
        </mesh>
      ))}
    </>
  );
};

export default PlayerCharacter;
