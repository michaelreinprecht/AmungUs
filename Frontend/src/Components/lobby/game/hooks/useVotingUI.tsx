import { sendIsVotingRequest } from "@/Components/utilityFunctions/webSocketHandler";
import { useEffect, useState } from "react";
import { useStompClient } from "react-stomp-hooks";

export function useVotingUI(
  initialTimer: number,
  setIsVotingActive: (isVotingActive: boolean) => void,
  setIsGamePaused: (isGamePaused: boolean) => void,
  lobbyCode: string
) {
  const [timer, setTimer] = useState(initialTimer);
  const stompClient = useStompClient();

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
    sendIsVotingRequest(false, stompClient, lobbyCode); //Send the voting result to the server
    setIsGamePaused(false); //Resume the game
  }

  return { timer, stopVoting };
}
