import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PlayerCharacterProps {
  scale: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ scale, bounds }) => {
  const colorMap = useLoader(TextureLoader, 'rick.png');

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
        case 'w':
          setMovement((prevMovement) => ({ ...prevMovement, forward: true }));
          break;
        case 's':
          setMovement((prevMovement) => ({ ...prevMovement, backward: true }));
          break;
        case 'a':
          setMovement((prevMovement) => ({ ...prevMovement, left: true }));
          break;
        case 'd':
          setMovement((prevMovement) => ({ ...prevMovement, right: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w':
          setMovement((prevMovement) => ({ ...prevMovement, forward: false }));
          break;
        case 's':
          setMovement((prevMovement) => ({ ...prevMovement, backward: false }));
          break;
        case 'a':
          setMovement((prevMovement) => ({ ...prevMovement, left: false }));
          break;
        case 'd':
          setMovement((prevMovement) => ({ ...prevMovement, right: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const speed = 0.5;
      const { forward, backward, left, right } = movement;
  
      // Calculate new position
      let newPositionX = meshRef.current.position.x;
      let newPositionY = meshRef.current.position.y;
  
      if (forward) newPositionY += speed;
      if (backward) newPositionY -= speed;
      if (left) newPositionX -= speed;
      if (right) newPositionX += speed;
  
      // Check against bounds and update position
      if (
        newPositionX - scale / 2 >= bounds.minX &&
        newPositionX + scale / 2 <= bounds.maxX
      ) {
        meshRef.current.position.x = newPositionX;
      }
      if (
        newPositionY - scale / 2 >= bounds.minY &&
        newPositionY + scale / 2 <= bounds.maxY
      ) {
        meshRef.current.position.y = newPositionY;
      }
    }
  });
  

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2 * scale, 2 * scale]} />
      <meshStandardMaterial map={colorMap} transparent={true} />
    </mesh>
  );
};

export default PlayerCharacter;
