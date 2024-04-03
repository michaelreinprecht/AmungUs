import { useState } from "react";
import "./App.css";
import { StompSessionProvider } from "react-stomp-hooks";
import Game from "./Components/Game";
import ChatWindow from "./Components/Chat/ChatWindow";
import PickNameScene from "./Components/PickNameScene";

function App() {
  const [activePlayerName, setActivePlayerName] = useState("");

  return (
    <>
      <StompSessionProvider url={"http://localhost:8080/amungUs-websocket"}>
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
