import { Client } from "react-stomp-hooks";

export function updatePlayerPosition(
  playerPos: any,
  stompClient: Client | undefined,
  lobbyCode: string
) {
  if (stompClient) {
    try {
      stompClient.publish({
        destination: `/app/${lobbyCode}/playerInfoReceiver`,
        body: JSON.stringify(playerPos),
      });
    } catch (error) {
      alert("Lost connection to server!");
    }
  }
}

export function sendHeartbeat(
  playerName: string,
  stompClient: Client | undefined,
  lobbyCode: string
) {
  try {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${lobbyCode}/heartbeatReceiver`,
        body: playerName,
      });
    }
  } catch (error) {
    alert("Lost connection to server!");
  }
}

export function sendKillRequest(
  killerName: string,
  victimName: string,
  stompClient: Client | undefined,
  lobbyCode: string
) {
  try {
    if (stompClient) {
      const requestBody = {
        killerName: killerName,
        victimName: victimName,
      };

      stompClient.publish({
        destination: `/app/${lobbyCode}/killReceiver`,
        body: JSON.stringify(requestBody),
      });
    }
  } catch (error) {
    alert("Lost connection to server!");
  }
}

export function corpseFoundRequest(
  corpsePlayerName: string,
  stompClient: Client | undefined,
  lobbyCode: string
) {
  try {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${lobbyCode}/corpseFoundReceiver`,
        body: corpsePlayerName,
      });
    }
  } catch (error) {
    alert("Lost connection to server!");
  }
}

export function sendIsVotingRequest(
  isVoting: boolean,
  stompClient: Client | undefined,
  lobbyCode: string
) {
  try {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/${lobbyCode}/isVotingReceiver`,
        body: isVoting.toString(),
      });
    }
  } catch (error) {
    alert("Lost connection to server!");
  }
}
