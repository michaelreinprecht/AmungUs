import { serverAddress } from "@/app/globals";
import { PlayerInfo } from "@/app/types";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

type StartGameUIProps = {
  lobbyCode: string;
  isGameStarted: boolean;
  currentPlayer: PlayerInfo | undefined;
};

export default function StartGameUI({
  lobbyCode,
  isGameStarted,
  currentPlayer,
}: StartGameUIProps) {
  const [lobbyClient, setLobbyClient] = useState<Client | undefined>();

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${serverAddress}:8080/lobbyService`,
    });
    client.activate();
    setLobbyClient(client);

    return () => {
      lobbyClient?.deactivate();
    };
  }, []);

  function sendStartGame() {
    if (lobbyClient && currentPlayer) {
      lobbyClient.publish({
        destination: `/app/${lobbyCode}/gameStartedReceiver`,
        body: JSON.stringify(currentPlayer),
      });
      const taskClient = new Client({
        brokerURL: `ws://${serverAddress}:8084/taskService`,
        onConnect: () => {
          taskClient.publish({
            destination: `/taskApp/getTasks/${lobbyCode}`,
            body: lobbyCode,
          });
        },
      });
      taskClient.activate();
    }
  }

  return (
    <>
      {!isGameStarted && (
        <>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 p-2 bg-gray-400 text-white text-2xl rounded-xl cursor-pointer">
            Waiting for host to start the game ...
          </div>

          {currentPlayer && currentPlayer.isHost && (
            <button
              onClick={() => sendStartGame()}
              className="start-game-button absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-green-500 text-white text-6xl rounded-xl cursor-pointer"
            >
              Start Game
            </button>
          )}
        </>
      )}
    </>
  );
}
