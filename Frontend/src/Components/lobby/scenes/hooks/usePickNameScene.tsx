import { getLobbyByCode } from "@/Components/utilityFunctions/APIService";
import { FormEvent, useState } from "react";

export function usePickNameScene(
  lobbyCode: string,
  setActivePlayerName: (newActivePlayerName: string) => void
) {
  const [errorMessage, setErrorMessage] = useState("");
  let playerNames = [""];
  let isLobbyFull = false;

  async function fetchPlayerNames() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/lobby/${lobbyCode}/playerNames`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch player names");
      }
      const data = await response.json();
      playerNames = data;
    } catch (error) {
      alert(
        "Unable to fetch player names, please make sure you are connected to the internet or try again later."
      );
      throw error;
    }
  }

  async function checkForFullLobby() {
    try {
      const lobbyData = await getLobbyByCode(lobbyCode);
      isLobbyFull =
        lobbyData.playerCount < lobbyData.maxPlayerCount ? false : true;
    } catch (error) {
      setErrorMessage("Error fetching lobby data:" + error);
    }
  }

  async function checkIfNameIsTaken(playerName: string) {
    await fetchPlayerNames();
    await checkForFullLobby();
    if (isLobbyFull) {
      //Set error if lobby is full
      setErrorMessage("Lobby is full");
    } else if (playerNames.includes(playerName)) {
      //Set error if playername is taken
      setErrorMessage("Name already taken");
    } else {
      //Set active player name if everything is fine
      setActivePlayerName(playerName);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPlayerName = data.get("playerName") as string;
    await checkIfNameIsTaken(newPlayerName);
  }

  return {
    errorMessage,
    onSubmit,
  };
}
