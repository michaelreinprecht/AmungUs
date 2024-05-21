import { useEffect, useState } from "react";
import PickNameScene from "./PickNameScene";
import Game from "../game/Game";
import { Client } from "@stomp/stompjs";

type LobbyProps = {
  lobbyCode: string;
  initialPlayerName?: string;
  initialPlayerCharacter?: string;
};

function LobbyScene({
  lobbyCode,
  initialPlayerName,
  initialPlayerCharacter,
}: LobbyProps) {
  const [activePlayerName, setActivePlayerName] = useState(
    initialPlayerName || ""
  );
  const [activePlayerCharacter, setActivePlayerCharacter] = useState(
    initialPlayerCharacter || ""
  );
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    // Check and set initial values if they are not already set
    if (!activePlayerName && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const playerName = urlParams.get("initialPlayerName");
      if (playerName) setActivePlayerName(playerName);
    }

    if (!activePlayerCharacter && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const playerCharacter = urlParams.get("initialPlayerCharacter");
      if (playerCharacter) setActivePlayerCharacter(playerCharacter);
    }
  }, []);

  return (
    <>
      {activePlayerName === "" && (
        <>
          <h1>Lobby Code: {lobbyCode}</h1>
          <PickNameScene
            setActivePlayerName={setActivePlayerName}
            setActivePlayerCharacter={setActivePlayerCharacter}
            lobbyCode={lobbyCode}
            isGameStarted={isGameStarted}
            setIsGameStarted={setIsGameStarted}
          />
        </>
      )}

      {activePlayerName !== "" && (
        <>
          <Game
            activePlayerName={activePlayerName}
            activePlayerCharacter={activePlayerCharacter}
            lobbyCode={lobbyCode}
            isGameStarted={isGameStarted}
          />
        </>
      )}
    </>
  );
}

export default LobbyScene;
