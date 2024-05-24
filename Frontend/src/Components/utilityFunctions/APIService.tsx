import { serverAddress } from "@/app/globals";

export async function getLobbyByCode(lobbyCode: string) {
  const response = await fetch(
    `http://${serverAddress}:8080/api/lobby/${lobbyCode}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch lobby data");
  }
  const lobbyData = await response.json();
  if (lobbyData) {
    return lobbyData;
  }
}
