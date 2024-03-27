import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

const Background = ({ textureUrl }: { textureUrl: string }) => {
  // Load the background texture
  const texture = useLoader(TextureLoader, textureUrl);

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <meshBasicMaterial map={texture} side={THREE.FrontSide} />
    </mesh>
  );
};

export default Background;
