import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { PlayerPosition } from "@/app/types";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

interface PlayerCorpseProps {
  isGamePaused: boolean;
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerPosition[];
  setPlayerPositions: (playerPositions: PlayerPosition[]) => void;
}

const PlayerCorpse: React.FC<PlayerCorpseProps> = ({
  isGamePaused,
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

  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();
  const [votingClient, setVotingClient] = useState<Client | undefined>();

  useEffect(() => {
    const lClient = new Client({
      brokerURL: "ws://localhost:8080/lobbyService",
      onConnect: () => {
        setLobbyClient(lClient);
      },
    });
    lClient.activate();
    const vClient = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        setVotingClient(vClient);
      },
    });
    vClient.activate();
  }, []);

  function startVoting(corpsePlayerName: string) {
    const votingStateRequest = {
      senderName: activePlayerName,
      votingState: true,
    };
    votingClient?.publish({
      destination: `/votingApp/${lobbyCode}/votingStateReceiver`,
      body: JSON.stringify(votingStateRequest),
    });
    const corpseFoundRequest = {
      senderName: activePlayerName,
      corpsePlayerName: corpsePlayerName,
    };
    lobbyClient?.publish({
      destination: `/app/${lobbyCode}/corpseFoundReceiver`,
      body: JSON.stringify(corpseFoundRequest),
    });
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
