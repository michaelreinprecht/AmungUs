import "./App.css";
import { StompSessionProvider } from "react-stomp-hooks";
import Game from "./Components/Game";
import ChatWindow from "./Components/Chat/ChatWindow";

function App() {
  //const [connected, setConnected] = useState(false);
  //const stompClient = useStompClient();

  // Function to handle the connect button click
  // function handleConnect() {
  //   if (stompClient && !connected) {
  //     setConnected(true);
  //     stompClient.activate();
  //   }
  // }

  return (
    <>
      <Game />
      <StompSessionProvider url={"http://localhost:8080/amungUs-websocket"}>
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
      </StompSessionProvider>
    </>
  );
}

export default App;
