import React, { useEffect, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Text } from "@react-three/drei";
import { Client } from "@stomp/stompjs";

interface EmergencyButtonProps {
  position: { x: number; y: number; z: number };
  texturePath: string;
  label: string;
  scale: number;
  isGamePaused: boolean;
  activePlayerName: string;
  lobbyCode: string;
  isEmergencyButtonOnCooldown: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  position,
  texturePath,
  label,
  scale,
  isGamePaused,
  activePlayerName,
  lobbyCode,
  isEmergencyButtonOnCooldown,
}) => {
  const texture = useLoader(TextureLoader, texturePath);

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

  function handleEmergencyClick() {
    if (!isGamePaused && !isEmergencyButtonOnCooldown) {
      const votingStateRequest = {
        senderName: activePlayerName,
        votingState: true,
      };
      votingClient?.publish({
        destination: `/votingApp/${lobbyCode}/votingStateReceiver`,
        body: JSON.stringify(votingStateRequest),
      });
      const teleportToSpawnRequest = {
        senderName: activePlayerName,
      };
      lobbyClient?.publish({
        destination: `/app/${lobbyCode}/teleportPlayersToSpawn`,
        body: JSON.stringify(teleportToSpawnRequest),
      });
    }
  }

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={handleEmergencyClick}
    >
      <mesh>
        <planeGeometry args={[2 * scale, 2 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          color={!isEmergencyButtonOnCooldown ? "white" : "gray"}
        />
      </mesh>

      <Text
        position={[0, scale, 0]}
        fontSize={0.6 * scale}
        color="orange"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01 * scale}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
};

export default EmergencyButton;
