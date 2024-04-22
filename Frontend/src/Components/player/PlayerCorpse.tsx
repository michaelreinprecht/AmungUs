import { ThreeEvent, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { PlayerPosition } from "@/app/types";
import { corpseFoundRequest } from "../utilityFunctions/webSocketHandler";
import { useStompClient } from "react-stomp-hooks";

interface PlayerCorpseProps {
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
}

const PlayerCorpse: React.FC<PlayerCorpseProps> = ({
  activePlayerName,
  scale,
  playerPositions,
  setPlayerPositions,
  lobbyCode,
  onNearestPlayerChange,
}) => {
  const { meshRef } = usePlayerCharacter({
    activePlayerName,
    scale,
    lobbyCode,
    onNearestPlayerChange,
    playerPositions,
    setPlayerPositions,
  });

  const colorMap = useLoader(TextureLoader, "/gravestone.png");
  const stompClient = useStompClient();

  function startVoting(corpsePlayerName: string) {
    //TODO: Pause game
    //TODO: Remove corpse
    corpseFoundRequest(corpsePlayerName, stompClient, lobbyCode);
    //TODO: Start voting
  }

  return (
    <>
      {playerPositions
        .filter((pos) => !pos.alive && !pos.corpseFound)
        .map((pos) => (
          <group
            key={pos.playerName}
            position={[pos.killedPlayerPositionX, pos.killedPlayerPositionY, 0]}
          >
            <mesh
              onClick={() => startVoting(pos.playerName)}
              ref={activePlayerName === pos.playerName ? meshRef : null}
            >
              <planeGeometry args={[2 * scale, 2 * scale]} />
              <meshStandardMaterial map={colorMap} transparent={true} />
            </mesh>
          </group>
        ))}
    </>
  );
};

export default PlayerCorpse;
