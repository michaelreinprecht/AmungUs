import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { TextureLoader } from "three";

export default function PlayerCharacter() {
  const colorMap = useLoader(TextureLoader, "mohr.png");

  const meshRef: React.MutableRefObject<any> = useRef(); // Create a ref for the mesh
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: { key: any }) => {
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

    const handleKeyUp = (event: { key: any }) => {
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
      const speed = 0.1; // Adjust the speed as needed
      const { forward, backward, left, right } = movement;
      if (forward) meshRef.current.position.y += speed;
      if (backward) meshRef.current.position.y -= speed;
      if (left) meshRef.current.position.x -= speed;
      if (right) meshRef.current.position.x += speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial map={colorMap} />
    </mesh>
  );
}
