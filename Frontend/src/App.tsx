import { useState } from 'react'
import './App.css'
import { StompSessionProvider, useStompClient } from 'react-stomp-hooks';
import MessageList from './Components/MessageList';
import MessageForm from './Components/MessageForm';

function App() {
  const [connected, setConnected] = useState(true);
  // const stompClient = useStompClient();

  // Function to handle the connect button click
  // function handleConnect() {
  //   if (stompClient && !connected) {
  //     setConnected(true);
  //     stompClient.activate();
  //   }
  // }

  return (
    <StompSessionProvider url={'http://localhost:8080/gs-guide-websocket'}>
      <div id="main-content" className="container">
        <div className="row">
          <div className="col-md-6">
            {/* Connect button */}
            <button className="btn btn-default" type="button">
              Connect
            </button>
          </div>
        </div>
        {/* Render MessageForm and MessageList only if connected */}
        {connected && (
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
  );
}

export default App;
