import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { VotingPlayerInfo, VotingRequest } from "@/app/types";

export function useVotingUI(
  initialTimer: number,
  lobbyCode: string,
  activePlayerName: string
) {
  const [timer, setTimer] = useState(initialTimer);
  const [votingPlayerInfos, setVotingPlayerInfos] = useState<
    VotingPlayerInfo[]
  >([]);

  const [votingClient, setVotingClient] = useState<Client | undefined>();
  let votingClientConnected = false;

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1); // Decrease timer by 1 every second
    }, 1000);

    // Clean up the interval when component unmounts or when timer reaches 0
    return () => clearInterval(timerInterval);
  }, []);

  // Subscribe to voting info updates
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8081/votingService",
      onConnect: () => {
        if (!votingClientConnected) {
          votingClientConnected = true;
          client.subscribe(`/voting/${lobbyCode}/votingInfo`, (message) => {
            const votingInfo = JSON.parse(message.body);
            setVotingPlayerInfos(votingInfo);
            console.log(votingInfo);
          });
          let emptyVotingRequest: VotingRequest = {
            votingPlayerName: "",
            votedPlayerName: "",
          };
          client.publish({
            destination: `/votingApp/${lobbyCode}/votingInfoReceiver`,
            body: JSON.stringify(emptyVotingRequest),
          });
        }
      },
    });
    client.activate();
    setVotingClient(client);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      stopVoting();
    }
  }, [timer]);

  // Function to handle adding a new vote
  function updateVote(votedPlayerName: string) {
    if (votingClient) {
      const votingRequest = {
        votingPlayerName: activePlayerName,
        votedPlayerName: votedPlayerName,
      };
      votingClient.publish({
        destination: `/votingApp/${lobbyCode}/votingInfoReceiver`,
        body: JSON.stringify(votingRequest),
      });
    }
  }

  function stopVoting() {
    if (votingClient != undefined) {
      const votingStateRequest = {
        senderName: activePlayerName,
        votingState: false,
      };
      votingClient.publish({
        destination: `/votingApp/${lobbyCode}/votingStateReceiver`,
        body: JSON.stringify(votingStateRequest),
      });
    }
  }

  return { timer, stopVoting, votingPlayerInfos, updateVote };
}
