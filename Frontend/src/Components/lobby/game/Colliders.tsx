import { RectangleCollider } from "@/app/types";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";

export default function Colliders() {
  const [colliders, setColliders] = useState<RectangleCollider[]>();
  const colliderTexture = useLoader(TextureLoader, "/bricks.jpg");

  useEffect(() => {
    async function fetchColliders() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/lobby/colliders"
        );
        colliders;
        if (!response.ok) {
          throw new Error("Failed to fetch colliders");
        }
        const data = (await response.json()) as RectangleCollider[];
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
          position={[collider.xPosition, collider.yPosition, 0]} //Real name is xposition and yposition
        >
          <planeGeometry args={[collider.width, collider.height]} />
          <meshStandardMaterial map={colliderTexture} />
        </mesh>
      ))}
    </group>
  );
}
