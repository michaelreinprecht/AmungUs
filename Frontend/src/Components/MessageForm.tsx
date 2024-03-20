import { useState } from "react";
import { useStompClient } from "react-stomp-hooks";

export default function MessageForm() {
    const stompClient = useStompClient();
    const [name, setName] = useState('');
  
    function sendName() {
      if (name && stompClient) {
        stompClient.publish({ destination: '/app/hello', body: JSON.stringify({ name }) });
      }
    }
  
    return (
      <div className="col-md-6">
          <div className="form-group">
            <label>What is your name?</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your name here..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="btn btn-default" onClick={sendName} type="button">
            Send
          </button>
      </div>
    );
  }