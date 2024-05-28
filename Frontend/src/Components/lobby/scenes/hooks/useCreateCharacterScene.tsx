import { getLobbyByCode } from "@/Components/utilityFunctions/APIService";
import { serverAddress } from "@/app/globals";
import { Client } from "@stomp/stompjs";
import { FormEvent, useEffect, useState } from "react";

export function useCreateCharacterScene(
  lobbyCode: string,
  isGameStarted: boolean,
  setActivePlayerName: (newActivePlayerName: string) => void,
  setActivePlayerCharacter: (newActivePlayerName: string) => void,
  hostPlayerName: string,
  hostPlayerCharacter: string,
  setIsGameStarted: (isGameStarted: boolean) => void,
  setIsJoiningPossible: (isJoiningPossible: boolean) => void
) {
  const [errorMessage, setErrorMessage] = useState("");
  let playerNames = [""];
  let playerCharacters = [""];
  let lobbyStarted = false;
  let isLobbyFull = false;

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${serverAddress}:8080/lobbyService`,
      onConnect: () => {
        client.subscribe(`/lobby/${lobbyCode}/gameStarted`, (message: any) => {
          const parsedGameStarted = JSON.parse(message.body) as boolean;
          if (parsedGameStarted) {
            setIsGameStarted(true);
          } else {
            setIsGameStarted(false);
          }
        });
      },
    });
    client.activate();
  }, []);

  useEffect(() => {
    attemptJoin(null);
  }, [hostPlayerName, hostPlayerCharacter]);

  async function fetchPlayerNames() {
    try {
      const response = await fetch(
        `http://${serverAddress}:8080/api/lobby/${lobbyCode}/playerNames`
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
        `http://${serverAddress}:8080/api/lobby/${lobbyCode}/playerCharacters`
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

  async function fetchGameStarted() {
    try {
      const response = await fetch(
        `http://${serverAddress}:8080/api/lobby/${lobbyCode}/gameStarted`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch gameStarted state");
      }
      const data = (await response.json()) as boolean;
      lobbyStarted = data;
    } catch (error) {
      alert(
        "Unable to fetch gameStarted state, please make sure you are connected to the internet or try again later."
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
    await fetchGameStarted();

    await checkForFullLobby();
    if (isGameStarted || lobbyStarted) {
      setErrorMessage("Game has already started");
    } else if (isLobbyFull) {
      //Set error if lobby is full
      setErrorMessage("Lobby is full");
    } else if (playerNames.includes(playerName)) {
      //Set error if playername is taken
      setErrorMessage("Name already taken");
    } else if (playerCharacters.includes(playerCharacter)) {
      setErrorMessage("Character already taken");
    } else if (playerName !== "" && playerCharacter !== "") {
      setActivePlayerCharacter(playerCharacter);
      setActivePlayerName(playerName);
      setIsJoiningPossible(true);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    attemptJoin(data);
  }

  async function attemptJoin(data: FormData | null) {
    let playerName = "";
    let selectedCharacter = "";
    if (hostPlayerName !== "" && hostPlayerCharacter !== "") {
      playerName = hostPlayerName;
      selectedCharacter = hostPlayerCharacter;
    }
    if (data) {
      playerName = data.get("playerName") as string;
      selectedCharacter = data.get("playerCharacter") as string;
    }
    await checkIfInputAvailable(playerName, selectedCharacter);
  }

  return {
    errorMessage,
    onSubmit,
  };
}
