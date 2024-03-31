import { FormEvent } from "react";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
}

export default function PickNameScene({
  setActivePlayerName,
}: PickNameSceneProps) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setActivePlayerName(data.get("activePlayerName") as string);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="activePlayerName"
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
    </>
  );
}
