import { getLobbyByCode } from "@/Components/utilityFunctions/APIService";
import { FormEvent, useState } from "react";

export function usePickNameScene(
  lobbyCode: string,
  setActivePlayerName: (newActivePlayerName: string) => void,
  setActivePlayerCharacter: (newActivePlayerName: string) => void
) {
  const [errorMessage, setErrorMessage] = useState("");
  let playerNames = [""];
  let playerCharacters = [""];
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

  async function fetchPlayerCharacters() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/lobby/${lobbyCode}/playerCharacters`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch player characters");
      }
      const data = await response.json();
      playerCharacters = data;
    } catch (error) {
      alert(
        "Unable to fetch player characters, please make sure you are connected to the internet or try again later."
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

  async function checkIfInputAvailable(
    playerName: string,
    playerCharacter: string
  ) {
    await fetchPlayerNames();
    await fetchPlayerCharacters();

    await checkForFullLobby();
    if (isLobbyFull) {
      //Set error if lobby is full
      setErrorMessage("Lobby is full");
    } else if (playerNames.includes(playerName)) {
      //Set error if playername is taken
      setErrorMessage("Name already taken");
    } else if (playerCharacters.includes(playerCharacter)) {
      setErrorMessage("Character already taken");
    } else {
      setActivePlayerCharacter(playerCharacter);
      setActivePlayerName(playerName);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const playerName = data.get("playerName") as string;
    const selectedCharacter = data.get("playerCharacter") as string;
    await checkIfInputAvailable(playerName, selectedCharacter);
  }

  return {
    errorMessage,
    onSubmit,
  };
}
