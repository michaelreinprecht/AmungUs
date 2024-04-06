import { useState } from "react";
import "./App.css";
import { StompSessionProvider } from "react-stomp-hooks";
import Game from "./Components/Game";
import ChatWindow from "./Components/Chat/ChatWindow";
import PickNameScene from "./Components/PickNameScene";

function App() {
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
          <PickNameScene setActivePlayerName={setActivePlayerName} />
        )}

        {activePlayerName !== "" && (
          <>
            <Game activePlayerName={activePlayerName} />
            <div id="main-content" className="container">
              {/* Render MessageForm and MessageList only if connected */}
              {true && (
                <>
                  <div className="row">
                    <ChatWindow />
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

export default App;
