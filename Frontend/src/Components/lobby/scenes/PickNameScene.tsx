import { FormEvent } from "react";
import { usePickNameScene } from "./hooks/usePickNameScene";
import { Theme, Container, Flex } from "@radix-ui/themes";
import * as Avatar from "@radix-ui/react-avatar";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
  lobbyCode: string;
}

export default function PickNameScene({
  setActivePlayerName,
  lobbyCode,
}: PickNameSceneProps) {
  const { errorMessage, onSubmit } = usePickNameScene(
    lobbyCode,
    setActivePlayerName
  );

  return (
    <>
      <Theme appearance="dark">
        <Container size="1">
          <div className="flex flex-col items-center pb-4">
            <img src="/amongus-logo.png" alt="Bildbeschreibung" />
            <Avatar.Root className="AvatarRoot">
              <Avatar.Image
                className="AvatarImage w-1/3 mx-auto"
                src="/character-logo.png"
                alt="AmungUs Logo"
              />
              <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                CT
              </Avatar.Fallback>
            </Avatar.Root>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-2 pb-4"
          >
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
  );
}
