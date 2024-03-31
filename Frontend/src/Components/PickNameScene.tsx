import { FormEvent, useState } from "react";
import { useSubscription } from "react-stomp-hooks";
import { PlayerPosition } from "./PlayerCharacter";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
}

export default function PickNameScene({
  setActivePlayerName,
}: PickNameSceneProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [activePlayerNames, setActivePlayerNames] = useState<string[]>([]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPlayerName = data.get("playerName") as string;
    checkIfNameIsTaken(newPlayerName);
  }

  // Check if name is already taken and display error if that's the case
  function checkIfNameIsTaken(playerName: string) {
    if (activePlayerNames.includes(playerName)) {
      setErrorMessage("Name already taken");
    } else {
      console.log("playerName: ", playerName);
      setActivePlayerName(playerName);
    }
  }

  // Subscribe to positions websocket and extract all player names
  useSubscription("/chat/positions", (message) => {
    const parsedMessage = JSON.parse(message.body);
    const playerPositions: PlayerPosition[] | undefined =
      parsedMessage.playerPositions;

    if (playerPositions) {
      const newPlayerNames = playerPositions.map(
        (position) => position.playerName
      );
      setActivePlayerNames(newPlayerNames);
    }
  });

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
