import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { usePlayerCharacter } from "./hooks/usePlayerCharacter";
import { PlayerInfo } from "@/app/types";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { Text } from "@react-three/drei";

interface PlayerCorpseProps {
  isGamePaused: boolean;
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  onNearestPlayerChange: (playerName: string) => void;
  playerPositions: PlayerInfo[];
  setPlayerPositions: (playerPositions: PlayerInfo[]) => void;
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
  const camera = useThree((state) => state.camera);

  const { meshRef } = usePlayerCharacter({
    camera,
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
    const teleportToSpawnRequest = {
      senderName: activePlayerName,
    };
    lobbyClient?.publish({
      destination: `/app/${lobbyCode}/teleportPlayersToSpawn`,
      body: JSON.stringify(teleportToSpawnRequest),
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
            <Text
              position={[0, scale, 0]}
              fontSize={0.6 * scale}
              color="red"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01 * scale}
              outlineColor="#000000"
            >
              {pos.playerName}
            </Text>
          </group>
        ))}
    </>
  );
};

export default PlayerCorpse;
