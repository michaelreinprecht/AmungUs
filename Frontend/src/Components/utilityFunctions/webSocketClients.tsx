import { serverAddress } from "@/app/globals";
import { Client } from "@stomp/stompjs";

let votingClient = new Client();
let lobbyClient = new Client();

export function getNewLobbyServiceClient() {
  lobbyClient = new Client({
    brokerURL: `ws://${serverAddress}:8080/lobbyService`,
  });
  return lobbyClient;
}

export function activateLobbyServiceClient() {
  lobbyClient.activate();
}

export function deactivateLobbyServiceClient() {
  lobbyClient.deactivate();
}

export function getNewVotingServiceClient() {
  votingClient = new Client({
    brokerURL: `ws://${serverAddress}:8081/votingService`,
  });
  return votingClient;
}

export function activateVotingServiceClient() {
  votingClient.activate();
}

export function deactivateVotingServiceClient() {
  votingClient.deactivate();
}
