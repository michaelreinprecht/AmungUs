import React, { useEffect, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Text } from "@react-three/drei";
import { Client } from "@stomp/stompjs";
import { serverAddress } from "@/app/globals";

interface EmergencyButtonProps {
  position: { x: number; y: number; z: number };
  texturePath: string;
  label: string;
  scale: number;
  isGamePaused: boolean;
  activePlayerName: string;
  lobbyCode: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  position,
  texturePath,
  label,
  scale,
  isGamePaused,
  activePlayerName,
  lobbyCode,
}) => {
  const texture = useLoader(TextureLoader, texturePath);

  const [votingClient, setVotingClient] = useState<Client | undefined>();
  const [lastEmergency, setLastEmergency] = useState<Date>();
  let votingClientConnected = false;

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${serverAddress}:8081/votingService`,
      onConnect: () => {
        if (!votingClientConnected) {
          votingClientConnected = true;
          client.subscribe(
            `/voting/${lobbyCode}/emergencyCooldown`,
            (message) => {
              setLastEmergency(new Date(message.body));
            }
          );
          setVotingClient(client);
        }
      },
    });
    client.activate();
  }, []);

  function isEmergencyButtonOnCooldown() {
    if (!lastEmergency) {
      return false;
    }
    const timeSinceLastEmergency =
      (new Date().getTime() - lastEmergency.getTime()) / 1000;
    if (timeSinceLastEmergency <= 30) {
      return true;
    }
    return false;
  }

  function handleEmergencyClick() {
    if (!isGamePaused && !isEmergencyButtonOnCooldown()) {
      const votingStateRequest = {
        senderName: activePlayerName,
        votingState: true,
      };
      votingClient?.publish({
        destination: `/votingApp/${lobbyCode}/emergencyVotingReceiver`,
        body: JSON.stringify(votingStateRequest),
      });
    }
  }

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={handleEmergencyClick}
    >
      <mesh>
        <planeGeometry args={[1.2 * scale, 1.2 * scale]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          color={!isEmergencyButtonOnCooldown() ? "white" : "gray"}
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
