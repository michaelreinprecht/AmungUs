import { Canvas } from "@react-three/fiber";
import PlayerCharacter from "./PlayerCharacter";

export default function Game() {
  return (
    <div className="w-screen h-screen">
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 64,
          near: 0.1,
          far: 64,
        }}
        orthographic
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
        <PlayerCharacter />
      </Canvas>
    </div>
  );
}
