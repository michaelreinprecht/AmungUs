import { useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import PickNameScene from "./PickNameScene";
import Game from "../game/Game";
import ChatWindow from "../chat/ChatWindow";

type LobbyProps = {
  lobbyCode: string;
};

function LobbyScene({ lobbyCode }: LobbyProps) {
  const [activePlayerName, setActivePlayerName] = useState("");

  return (
    <>
      <StompSessionProvider
        url={"http://localhost:8080/amungUs-websocket"}
        reconnectDelay={5}
        onWebSocketClose={() => {
          setTimeout(() => {
            //Fires once when connecting ..., onDisconnect also fires aaaalot
          }, 5000);
        }}
        onStompError={() => {
          setTimeout(() => {
            alert("Connection lost");
          }, 5000);
        }}
      >
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
      </StompSessionProvider>
    </>
  );
}

export default LobbyScene;
