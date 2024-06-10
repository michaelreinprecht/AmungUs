import { serverAddress } from "@/app/globals";
import { Client } from "@stomp/stompjs";
import { useState, useEffect } from "react";

export default function SabotageTextUI({ sabotageInitiated, lobbyCode }: { sabotageInitiated: boolean , lobbyCode: string } ) {
  const sabotageTime = 60;
  const [timer, setTimer] = useState(sabotageTime);
  const [hasTimerEnded, setHasTimerEnded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sabotageInitiated && !hasTimerEnded) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setTimer(sabotageTime);
      setHasTimerEnded(false);
    };
  }, [sabotageInitiated]);

  useEffect(() => {
    if (sabotageInitiated) {
      setTimer(sabotageTime);
      setHasTimerEnded(false);
    }
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setHasTimerEnded(true);
      const sabotageClient = new Client({
        brokerURL: `ws://${serverAddress}:8085/sabotageService`,
        onConnect: () => {
          sabotageClient.publish({
            destination: `/sabotageApp/sabotageSuccess/${lobbyCode}`,
            body: lobbyCode,
          });
        },
      });
      sabotageClient.activate();
    }
  }, [timer]);

  return (
    sabotageInitiated && (
      <div className="sabotage absolute top-0 left-1/2 -translate-x-1/2 text-red-600 text-center mt-4 p-4 bg-gray-700 rounded" style={{fontSize: '2rem', boxShadow: '2px 2px 6px rgba(0,0,0,0.5)'}}>
        Sabotage initiated! A crewmate has to solve the sabotage task before the time runs out. Look at the map to find it!
        <br />
        <span className="text-red-600">
          Time remaining: {timer} seconds {hasTimerEnded && '(Timer has ended)'}
        </span>
      </div>
    )
  );
}


