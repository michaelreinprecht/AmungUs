import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useVotingUI(initialTimer: number, lobbyCode: string) {
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1); // Decrease timer by 1 every second
    }, 1000);

    // Clean up the interval when component unmounts or when timer reaches 0
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      stopVoting();
    }
  }, [timer]);

  function stopVoting() {
    const votingClient = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        votingClient.publish({
          destination: `/votingApp/${lobbyCode}/votingStateReceiver`,
          body: JSON.stringify(false),
        });
      },
    });
    votingClient.activate();
  }

  return { timer, stopVoting };
}
