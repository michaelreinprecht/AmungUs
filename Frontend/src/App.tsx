import './App.css';
import { StompSessionProvider} from 'react-stomp-hooks';
import MessageForm from './Components/MessageForm';
import MessageList from './Components/MessageList';
import MovingImage from './Components/MovingImage';

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
    <MovingImage/>
    <StompSessionProvider url={'http://localhost:8080/gs-guide-websocket'}>
      <div id="main-content" className="container">
        {/* Render MessageForm and MessageList only if connected */}
        {true && (
          <>
            <div className="row">
              <MessageForm />
            </div>
            <div className="row">
              <MessageList />
            </div>
          </>
        )}
      </div>
    </StompSessionProvider>
    </>
  );
}

export default App;
