import { FormEvent } from "react";
import { usePickNameScene } from "./hooks/usePickNameScene";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
  lobbyCode: string;
}

export default function PickNameScene({
  setActivePlayerName,
  lobbyCode,
}: PickNameSceneProps) {
  const { errorMessage, checkIfNameIsTaken } = usePickNameScene(lobbyCode, setActivePlayerName);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPlayerName = data.get("playerName") as string;
    await checkIfNameIsTaken(newPlayerName);
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
