import { ThreeEvent, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { PlayerPosition } from "@/app/types";
import { corpseFoundRequest } from "../utilityFunctions/webSocketHandler";
import { useStompClient } from "react-stomp-hooks";

interface PlayerCorpseProps {
  isGamePaused: boolean;
  setIsGamePaused: (isGamePaused: boolean) => void;
  setIsVotingActive: (isVotingActive: boolean) => void;
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
}

const PlayerCorpse: React.FC<PlayerCorpseProps> = ({
  isGamePaused,
  setIsGamePaused,
  setIsVotingActive,
  activePlayerName,
  scale,
  playerPositions,
  setPlayerPositions,
  lobbyCode,
  onNearestPlayerChange,
}) => {
  const { meshRef } = usePlayerCharacter({
    isGamePaused,
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
    //Pause the game while voting
    setIsGamePaused(true);
    //Remove the corpse from the game
    //TODO: Maybe move this to after voting finished? -> probably doesn't matter
    corpseFoundRequest(corpsePlayerName, stompClient, lobbyCode);
    //Display voting UI
    setIsVotingActive(true);
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
