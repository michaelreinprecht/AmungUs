import { FormEvent, useState } from "react";
import { usePickNameScene } from "./hooks/usePickNameScene";
import { Theme, Container, Flex } from "@radix-ui/themes";
import * as Avatar from "@radix-ui/react-avatar";
import { CSSProperties } from "react";

interface PickNameSceneProps {
  setActivePlayerName: (newActivePlayerName: string) => void;
  setActivePlayerCharacter: (newActivePlayerCharacter: string) => void;
  lobbyCode: string;
}

const pixelArtStyle: CSSProperties = {
  imageRendering: 'pixelated',
  width: '96px', 
  height: '128px', 
};

const characterOptions = [
  {
    id: "character-1",
    name: "Character 1",
    avatarSrc: "/character-1-move-1.png",
  },
  {
    id: "character-2",
    name: "Character 2",
    avatarSrc: "/character-2-move-1.png",
  },
  {
    id: "character-3",
    name: "Character 3",
    avatarSrc: "/character-3-move-1.png",
  },
  {
    id: "character-4",
    name: "Character 4",
    avatarSrc: "/character-4-move-1.png",
  },
  {
    id: "character-5",
    name: "Character 5",
    avatarSrc: "/character-5-move-1.png",
  },
];

export default function PickNameScene({
  setActivePlayerName,
  setActivePlayerCharacter,
  lobbyCode,
}: PickNameSceneProps) {
  const { errorMessage, onSubmit } = usePickNameScene(
    lobbyCode,
    setActivePlayerName,
    setActivePlayerCharacter
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
