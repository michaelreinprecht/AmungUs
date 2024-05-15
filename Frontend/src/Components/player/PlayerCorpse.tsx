import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { PlayerInfo } from "@/app/types";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { Text } from "@react-three/drei";

interface PlayerCorpseProps {
  activePlayerName: string;
  scale: number;
  lobbyCode: string;
  playerPositions: PlayerInfo[];
}

const PlayerCorpse: React.FC<PlayerCorpseProps> = ({
  activePlayerName,
  scale,
  playerPositions,
  lobbyCode,
}) => {
  const camera = useThree((state) => state.camera);

  const colorMap = useLoader(TextureLoader, "/gravestone.png");

  const [votingClient, setVotingClient] = useState<Client | undefined>();

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        setVotingClient(client);
      },
    });
    client.activate();
  }, []);

  function startVoting() {
    const votingStateRequest = {
      senderName: activePlayerName,
      votingState: true,
    };
    votingClient?.publish({
      destination: `/votingApp/${lobbyCode}/votingStateReceiver`,
      body: JSON.stringify(votingStateRequest),
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
            <mesh onClick={() => startVoting()}>
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
