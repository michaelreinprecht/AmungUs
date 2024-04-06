import { useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import PickNameScene from "./PickNameScene";
import Game from "./Game";
import ChatWindow from "./Chat/ChatWindow";

type LobbyProps = {
  lobbyCode: string;
};

function Lobby({ lobbyCode }: LobbyProps) {
  const [activePlayerName, setActivePlayerName] = useState("");
  let [connectionError, setConnectionError] = useState(false);

  /*
  onConnect={() => {
            setConnectionError(true);
          }}
          onDisconnect={() => {
            setTimeout(() => {
              setConnectionError(false);
            }, 5000);
          }}
          onWebSocketClose={() => {
            setTimeout(() => {
              setConnectionError(false);
            }, 5000);
          }}
          onStompError={() => {
            setTimeout(() => {
              setConnectionError(false);
            }, 5000);
          }}
  */

  return (
    <>
      <StompSessionProvider
        url={"http://localhost:8080/amungUs-websocket"}
        reconnectDelay={5}
      >
        {connectionError && <h1>Connection Error</h1>}
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
            <div id="main-content" className="container">
              {/* Render MessageForm and MessageList only if connected */}
              {true && (
                <>
                  <div className="row">
                    <ChatWindow
                      activePlayerName={activePlayerName}
                      lobbyCode={lobbyCode}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </StompSessionProvider>
    </>
  );
}

export default Lobby;
