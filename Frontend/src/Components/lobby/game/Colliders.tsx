import { RectangleCollider } from "@/app/types";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";

type CollidersProps = {
  scale: number;
};

export default function Colliders({ scale }: CollidersProps) {
  const [colliders, setColliders] = useState<RectangleCollider[]>();
  const colliderTexture = useLoader(TextureLoader, "/bricks.jpg");

  useEffect(() => {
    async function fetchColliders() {
      try {
        const response = await fetch("http://localhost:8080/api/lobby/");
        colliders;
        if (!response.ok) {
          throw new Error("Failed to fetch colliders");
        }
        const data = await response.json();
        setColliders(data);
      } catch (error) {
        console.error("Error fetching colliders:", error);
      }
    }

    fetchColliders();
  }, []);

  return (
    <group>
      {colliders?.map((collider, index) => (
        <mesh
          key={index}
          position={[collider.xPosition, collider.yPosition, 0]}
        >
          <planeGeometry
            args={[collider.width * scale, collider.height * scale]}
          />
          <meshStandardMaterial map={colliderTexture} />
        </mesh>
      ))}
    </group>
  );
}
