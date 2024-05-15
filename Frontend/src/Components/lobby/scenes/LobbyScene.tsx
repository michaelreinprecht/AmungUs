import { useEffect, useState } from "react";
import PickNameScene from "./PickNameScene";
import Game from "../game/Game";

type LobbyProps = {
  lobbyCode: string;
};

function LobbyScene({ lobbyCode }: LobbyProps) {
  const [activePlayerName, setActivePlayerName] = useState("");
  const [activePlayerCharacter, setActivePlayerCharacter] = useState("");

  //TODO: Remove after testing is done
  useEffect(() => {
    console.log("Use effect called in LobbyScene.tsx");
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
          />
        </>
      )}

      {activePlayerName !== "" && (
        <>
          <Game
            activePlayerName={activePlayerName}
            activePlayerCharacter={activePlayerCharacter}
            lobbyCode={lobbyCode}
          />
        </>
      )}
    </>
  );
}

export default LobbyScene;
