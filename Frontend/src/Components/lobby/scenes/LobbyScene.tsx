import { useEffect, useState } from "react";
import CreateCharacterScene from "./CreateCharacterScene";
import Game from "../game/Game";

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
  const [isJoiningPossible, setIsJoiningPossible] = useState<boolean>(false);
  const [hostPlayerName, setHostPlayerName] = useState<string>(
    initialPlayerName || ""
  );
  const [hostPlayerCharacter, setHostPlayerCharacter] = useState<string>(
    initialPlayerName || ""
  );
  const [activePlayerName, setActivePlayerName] = useState(
    initialPlayerName || ""
  );
  const [activePlayerCharacter, setActivePlayerCharacter] = useState(
    initialPlayerCharacter || ""
  );
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    // Check and set initial values if they are not already set
    if (
      !activePlayerName &&
      !activePlayerCharacter &&
      typeof window !== "undefined"
    ) {
      const urlParams = new URLSearchParams(window.location.search);
      const playerName = urlParams.get("initialPlayerName");
      const playerCharacter = urlParams.get("initialPlayerCharacter");

      if (playerName && playerCharacter) {
        setActivePlayerName(playerName);
        setHostPlayerName(playerName);
        setActivePlayerCharacter(playerCharacter);
        setHostPlayerCharacter(playerCharacter);
      }
    }
  }, []);

  return (
    <>
      {!isJoiningPossible && (
        <>
          <h1>Lobby Code: {lobbyCode}</h1>
          <CreateCharacterScene
            setActivePlayerName={setActivePlayerName}
            setActivePlayerCharacter={setActivePlayerCharacter}
            hostPlayerName={hostPlayerName}
            hostPlayerCharacter={hostPlayerCharacter}
            lobbyCode={lobbyCode}
            isGameStarted={isGameStarted}
            setIsGameStarted={setIsGameStarted}
            setIsJoiningPossible={setIsJoiningPossible}
          />
        </>
      )}

      {isJoiningPossible && (
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
