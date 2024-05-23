import React, { useEffect, useState } from "react";
import { useCreateCharacterScene } from "./hooks/useCreateCharacterScene";
import { Theme, Container } from "@radix-ui/themes";
import * as Avatar from "@radix-ui/react-avatar";
import { CSSProperties } from "react";
import { characterOptions } from "@/app/globals";
import Select from 'react-select';

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

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#4A5568',
    borderColor: '#4A5568',
    color: '#4A5568',
  }),
  option: (provided: any, state: { isSelected: any; isFocused: any; isDisabled: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#1a1a1a' : '#000000',
    color: state.isSelected ? '#ffffff' : state.isFocused ? '#ffffff' : '#ffffff',
    opacity: state.isDisabled ? 0.5 : 1,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
    borderColor: '#4A5568',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#4A5568',
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
    color: '#ffffff',
  }),
};

export default function CreateCharacterScene({
  setActivePlayerName,
  setActivePlayerCharacter,
  lobbyCode,
  isGameStarted,
  setIsGameStarted,
}: PickNameSceneProps) {
  const { errorMessage, onSubmit } = useCreateCharacterScene(
    lobbyCode,
    isGameStarted,
    setActivePlayerName,
    setActivePlayerCharacter,
    setIsGameStarted
  );
  const [selectedCharacter, setSelectedCharacter] = useState(characterOptions[0]);
  const [disabledCharacterIds, setDisabledCharacterIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/lobby/${lobbyCode}/playerCharacters`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDisabledCharacterIds(data);
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [lobbyCode]);

  useEffect(() => {
    if (disabledCharacterIds.includes(selectedCharacter.id)) {
      const firstAvailableCharacter = characterOptions.find(
        (character) => !disabledCharacterIds.includes(character.id)
      );
      if (firstAvailableCharacter) {
        setSelectedCharacter(firstAvailableCharacter);
      }
    }
  }, [disabledCharacterIds, selectedCharacter.id]);

  const characterOptionsWithAvatars = characterOptions.map(character => ({
    value: character.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={character.avatarSrc}
          alt={character.name}
          style={{ width: '24px', height: '32px', marginRight: '10px', imageRendering: 'pixelated' }}
        />
        {character.name}
      </div>
    ),
    isDisabled: disabledCharacterIds.includes(character.id),
  }));

  return (
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

        <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 pb-4">
          <Select
            name="playerCharacter"
            value={characterOptionsWithAvatars.find(option => option.value === selectedCharacter.id)}
            onChange={(option) => {
              const newCharacter = characterOptions.find(character => character.id === option?.value);
              if (newCharacter) {
                setSelectedCharacter(newCharacter);
              }
            }}
            options={characterOptionsWithAvatars}
            isOptionDisabled={(option) => option.isDisabled}
            styles={customStyles}
            className="pt-1 pb-1 block w-full border-gray-700 rounded-md"
            />
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
  );
}
