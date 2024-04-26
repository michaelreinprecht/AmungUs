import { useState } from "react";
import PickNameScene from "./PickNameScene";
import Game from "../game/Game";

type LobbyProps = {
  lobbyCode: string;
};

function LobbyScene({ lobbyCode }: LobbyProps) {
  const [activePlayerName, setActivePlayerName] = useState("");

  return (
    <>
      {activePlayerName === "" && (
        <>
          <h1>Lobby Code: {lobbyCode}</h1>
          <PickNameScene
            setActivePlayerName={setActivePlayerName}
            lobbyCode={lobbyCode}
          />
        </>
      )}

      {activePlayerName !== "" && (
        <>
          <Game activePlayerName={activePlayerName} lobbyCode={lobbyCode} />
        </>
      )}
    </>
  );
}

export default LobbyScene;
