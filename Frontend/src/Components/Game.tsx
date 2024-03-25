import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Background from './Background';
import PlayerCharacter from './PlayerCharacter';

export default function Game() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Bounds that match the background
  const bounds = {
    minX: -50, // Minimum x-coordinate
    maxX: 50, // Maximum x-coordinate
    minY: -45, // Minimum y-coordinate
    maxY: 45, // Maximum y-coordinate
  };

  return (
    <div ref={canvasRef} className="w-screen h-screen">
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 10,
          near: 0.1,
          far: 64,
          aspect: canvasRef.current ? canvasRef.current.clientWidth / canvasRef.current.clientHeight : undefined,
        }}
        orthographic
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Ambient light and directional light */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />

        {/* Background component */}
        <Background textureUrl="background.jpg" />

        {/* Render player character */}
        <PlayerCharacter scale={5} bounds={bounds}/>
      </Canvas>
    </div>
  );
}
