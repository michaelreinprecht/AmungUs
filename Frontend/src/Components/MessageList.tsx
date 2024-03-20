import { useState } from "react";
import { useSubscription } from "react-stomp-hooks";

export default function MessageList() {
    const [greetings, setGreetings] = useState<Array<string>>([]);
    useSubscription('/topic/greetings', (message) => {
      setGreetings((prevGreetings) => [...prevGreetings, JSON.parse(message.body).content]);
    });
  
    return (
      <div className="col-md-12">
        <table id="conversation" className="table table-striped">
          <thead>
            <tr>
              <th>Greetings</th>
            </tr>
          </thead>
          <tbody id="greetings">
            {greetings.map((greeting, index) => (
              <tr key={index}>
                <td>{greeting}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }