import { ThreeEvent, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { PlayerInfo } from "@/app/types";

type VentObjectProps = {
  position: [number, number, number];
  scale: number;
  currentPlayerInfo: PlayerInfo | undefined; // Accept player object as a prop
  id: number;
};

function VentObject({
  position,
  scale,
  currentPlayerInfo,
  id,
}: VentObjectProps) {
  const texture = useLoader(TextureLoader, "/vent.png");

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (currentPlayerInfo?.playerRole === "killer") {
      if (id === 1) {
        currentPlayerInfo.playerPositionX = -180;
        currentPlayerInfo.playerPositionY = -110;
      }
      if (id === 2) {
        currentPlayerInfo.playerPositionX = -189;
        currentPlayerInfo.playerPositionY =  64;
      }
      if (id === 3) {
        currentPlayerInfo.playerPositionX = 198;
        currentPlayerInfo.playerPositionY = 62;
      }
      if (id === 4) {
        currentPlayerInfo.playerPositionX = 142;
        currentPlayerInfo.playerPositionY = -110;
      }
    }
    event.stopPropagation();
  };

  return (
    <mesh position={position} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={[1 * scale, 1 * scale, 1 * scale]} />
      <meshStandardMaterial map={texture} transparent={true} />
    </mesh>
  );
}

export default VentObject;
