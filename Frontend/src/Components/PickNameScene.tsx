import { notFound, redirect } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { not } from "three/examples/jsm/nodes/Nodes.js";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
  lobbyCode: string;
}

export default function PickNameScene({
  setActivePlayerName,
  lobbyCode,
}: PickNameSceneProps) {
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPlayerName = data.get("playerName") as string;
    await checkIfNameIsTaken(newPlayerName);
  }

  // Check if name is already taken and display error if that's the case
  async function checkIfNameIsTaken(playerName: string) {
    await fetchPlayerNames();
    if (playerNames.includes(playerName)) {
      setErrorMessage("Name already taken");
    } else {
      console.log("playerName: ", playerName);
      setActivePlayerName(playerName);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="playerName"
          type="text"
          className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
          placeholder="Enter your name ..."
          required
        />
        <input
          type="submit"
          className="form-control flex-grow w-full p-2 border border-gray-300 rounded-l"
          value="Submit"
        />
      </form>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}
