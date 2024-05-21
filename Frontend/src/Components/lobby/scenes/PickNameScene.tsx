import { FormEvent, useState } from "react";
import { usePickNameScene } from "./hooks/usePickNameScene";
import { Theme, Container, Flex } from "@radix-ui/themes";
import * as Avatar from "@radix-ui/react-avatar";
import { CSSProperties } from "react";
import { characterOptions } from "@/app/globals";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
  setActivePlayerCharacter: (newActivePlayerCharacter: string) => void;
  lobbyCode: string;
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
}

const pixelArtStyle: CSSProperties = {
  imageRendering: "pixelated",
  width: "96px",
  height: "128px",
};

export default function PickNameScene({
  setActivePlayerName,
  setActivePlayerCharacter,
  lobbyCode,
  isGameStarted,
  setIsGameStarted,
}: PickNameSceneProps) {
  const { errorMessage, onSubmit } = usePickNameScene(
    lobbyCode,
    isGameStarted,
    setActivePlayerName,
    setActivePlayerCharacter,
    setIsGameStarted
  );
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterOptions[0]
  );

  return (
    <>
      <Theme appearance="dark">
        <Container size="1">
          <div className="flex flex-col items-center pb-4">
            <img src="/amongus-logo.png" alt="Bildbeschreibung" />
            <Avatar.Root className="AvatarRoot">
              <Avatar.Image
                className="AvatarImage pixel-art mx-auto"
                src={selectedCharacter.avatarSrc}
                alt={selectedCharacter.name}
                style={pixelArtStyle}
              />
              <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                {selectedCharacter.name.charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-2 pb-4"
          >
            <select
              name="playerCharacter"
              value={selectedCharacter.id}
              onChange={(e) => {
                const newCharacter = characterOptions.find(
                  (option) => option.id === e.target.value
                );
                if (newCharacter) {
                  setSelectedCharacter(newCharacter);
                } else {
                  console.error("Selected character not found!");
                }
              }}
              className="form-control w-full p-2 border border-gray-300 rounded"
            >
              {characterOptions.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
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
