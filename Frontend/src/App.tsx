import React, { FormEvent, useState } from "react";
import "./App.css";
import { StompSessionProvider } from "react-stomp-hooks";
import Game from "./Components/Game";
import ChatWindow from "./Components/Chat/ChatWindow";

function App() {
  const [playerName, setPlayerName] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPlayerName(data.get("playerName") as string);
  }

  return (
    <>
      <StompSessionProvider url={"http://localhost:8080/amungUs-websocket"}>
        {playerName === "" && (
          <>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="playerName"
                className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
                placeholder="Enter your name ..."
                required
              />
              <input
                type="submit"
                className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
                value="Submit"
              />
            </form>
          </>
        )}

        {playerName !== "" && (
          <>
            <Game />
            {/* Pass playerName as prop to Game component */}
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
