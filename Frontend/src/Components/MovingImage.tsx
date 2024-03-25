import { Canvas } from "@react-three/fiber";
import MovingRectangle from "./MovingRectangle";

export default function MovingImage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
        <MovingRectangle />
      </Canvas>
    </div>
  );
}
