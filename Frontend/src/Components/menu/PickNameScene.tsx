import { FormEvent } from "react";
import { usePickNameScene } from "./hooks/usePickNameScene";
import "../../app/globals.css";
import { Theme, Container, Flex } from "@radix-ui/themes";
import * as Avatar from '@radix-ui/react-avatar';
import "../../app/PickNameSceneStyle.css";

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
    <Theme appearance="light">
      <Container size="1">
      <div className="flex flex-col items-center pb-4">
      <img src="/amongus-logo.png" alt="Bildbeschreibung"/>
      <Avatar.Root className="AvatarRoot">
      <Avatar.Image
        className="AvatarImage"
        src="/character-logo.png"
        alt="Colm Tuite"
      />
      <Avatar.Fallback className="AvatarFallback" delayMs={600}>
        CT
      </Avatar.Fallback>
    </Avatar.Root>
    </div>
        
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 pb-4">
          <input
            name="playerName"
            type="text"
            className="form-control w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your name ..."
            required
          />
        
          <input
            type="submit"
            className="form-control w-full p-2 border border-gray-300 rounded"
            value="Submit"
          />
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </Container>
    </Theme>

    </>
        
    )
}
