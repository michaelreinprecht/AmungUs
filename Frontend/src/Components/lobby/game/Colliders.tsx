import { RectangleCollider } from "@/app/types";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";

export default function Colliders() {
  const [colliders, setColliders] = useState<RectangleCollider[]>([
    {
      xPosition: 26,
      yPosition: 72,
      width: 20,
      height: 24,
    }, //ButtonCollider
    {
      xPosition: 76,
      yPosition: -1,
      width: 97,
      height: 59,
    },
    {
      //ButtonRoom
      xPosition: -24,
      yPosition: -1,
      width: 65,
      height: 59,
    },
    {
      xPosition: 104,
      yPosition: 42,
      width: 42,
      height: 59,
    },
    {
      xPosition: 104,
      yPosition: 130,
      width: 42,
      height: 59,
    },
    {
      xPosition: -76,
      yPosition: 60,
      width: 82,
      height: 15,
    },
    {
      xPosition: -80,
      yPosition: 24,
      width: 17,
      height: 58,
    },
    {
      xPosition: -76,
      yPosition: 114,
      width: 81,
      height: 46,
    },
    {
      xPosition: 23,
      yPosition: 130,
      width: 130,
      height: 12,
    }, //Room to the left
    {
      xPosition: -154,
      yPosition: 127,
      width: 90,
      height: 25,
    },
    {
      xPosition: -216,
      yPosition: 84,
      width: 40,
      height: 100,
    },
    {
      xPosition: -204,
      yPosition: 33,
      width: 72,
      height: 45,
    },
    {
      xPosition: -115,
      yPosition: 33,
      width: 65,
      height: 47,
    },
    {
      //Room to bottom left
      xPosition: -178,
      yPosition: 8,
      width: 20,
      height: 25,
    },
    {
      xPosition: -238,
      yPosition: -17,
      width: 20,
      height: 60,
    },
    {
      xPosition: -203,
      yPosition: -61,
      width: 70,
      height: 43,
    },
    {
      xPosition: -178,
      yPosition: -35,
      width: 20,
      height: 20,
    },
    {
      //Room to bottom
      xPosition: -215,
      yPosition: -107,
      width: 38,
      height: 60,
    },
    {
      xPosition: -163,
      yPosition: -134,
      width: 70,
      height: 20,
    },
    {
      xPosition: -102,
      yPosition: -90,
      width: 60,
      height: 100,
    },
    {
      xPosition: -138,
      yPosition: -54,
      width: 20,
      height: 58,
    },
    {
      //Room to top right
      xPosition: -138,
      yPosition: 6,
      width: 20,
      height: 20,
    },
    {
      xPosition: -80,
      yPosition: -35,
      width: 16,
      height: 20,
    },
    {
      //Room to bottom right
      xPosition: -38,
      yPosition: -41,
      width: 37,
      height: 40,
    },
    {
      xPosition: -55,
      yPosition: -111,
      width: 70,
      height: 60,
    },
    {
      xPosition: 16,
      yPosition: -134,
      width: 100,
      height: 20,
    },
    {
      xPosition: 88,
      yPosition: -103,
      width: 72,
      height: 100,
    },
    {
      //room to the very top right
      xPosition: 155,
      yPosition: 118,
      width: 100,
      height: 20,
    },
    {
      xPosition: 214,
      yPosition: 100,
      width: 20,
      height: 90,
    },
    {
      //Hallway to the right middle
      xPosition: 193,
      yPosition: 16,
      width: 40,
      height: 79,
    },
    {
      xPosition: 135,
      yPosition: 16,
      width: 40,
      height: 79,
    },
    {
      //room inbetween the very right ones
      xPosition: 224,
      yPosition: -29,
      width: 40,
      height: 79,
    },
  ]);
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
        //setColliders(data);
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
