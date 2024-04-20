import { Client } from "react-stomp-hooks";

export function updatePlayerPosition(playerPos: any, stompClient: Client | undefined, lobbyCode: string) {
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

export function sendHeartbeat(playerName: string, stompClient: Client | undefined, lobbyCode: string) {
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