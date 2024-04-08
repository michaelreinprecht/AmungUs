import { useState } from "react";

export function usePickNameScene(lobbyCode: string, setActivePlayerName: (newActivePlayerName: string) => void) {
  const [errorMessage, setErrorMessage] = useState("");
  let playerNames = [""];

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

  async function checkIfNameIsTaken(playerName: string) {
    await fetchPlayerNames();
    if (playerNames.includes(playerName)) {
      setErrorMessage("Name already taken");
    } else {
      setActivePlayerName(playerName);
    }
  }

  return {
    errorMessage,
    checkIfNameIsTaken
  };
}
