import React, { useState, useEffect } from "react";
import useCreateLobbyScene from "@/Components/menu/hooks/useCreateLobbyScene";
import { characterOptions } from "@/app/globals";
import * as Avatar from "@radix-ui/react-avatar";
import { Theme, Container } from "@radix-ui/themes";
import Select from 'react-select';

const pixelArtStyle = {
  imageRendering: "pixelated",
  width: "96px",
  height: "128px",
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#4A5568',
    borderColor: '#4A5568', // corresponds to border-gray-700
    color: '#4A5568',
  }),
  option: (provided: any, state: { isSelected: any; isFocused: any; isDisabled: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#000000' : state.isFocused ? '#1a1a1a' : '#000000',
    color: state.isSelected ? '#ffffff' : state.isFocused ? '#ffffff' : '#ffffff',
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : 'default',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#ffffff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
    borderColor: '#4A5568', // corresponds to border-gray-700
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#ffffff', // color of the dropdown arrow
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#ffffff', // color of the entered text
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#ffffff', // color of the placeholder
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#4A5568', // corresponds to border-gray-700
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    backgroundColor: '#000000',
    color: '#ffffff',
  }),
};

export default function CreateLobbyScene() {
  const {
    maxPlayerCount,
    maxKillerCount,
    isPrivate,
    playerName,
    playerCharacter,
    setMaxPlayerCount,
    setMaxKillerCount,
    setIsPrivate,
    setPlayerName,
    setPlayerCharacter,
    createLobby,
  } = useCreateLobbyScene();

  const [selectedCharacter, setSelectedCharacter] = useState(
    characterOptions.find((character) => character.id === playerCharacter) ||
      characterOptions[0]
  );

  useEffect(() => {
    const character = characterOptions.find(
      (character) => character.id === playerCharacter
    );
    if (character) {
      setSelectedCharacter(character);
    }
  }, [playerCharacter]);

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
  }));

  return (
    <Theme appearance="dark">
      <Container className="bg-gray-800 flex items-center justify-center min-h-screen">
        <div className="mx-auto bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
          <h1 className="text-3xl font-bold text-white mb-4">Create Lobby</h1>
          <form onSubmit={createLobby}>
            <div className="mb-4">
              <label
                htmlFor="playerName"
                className="block text-sm font-medium text-white"
              >
                Player Name:
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="playerCharacter"
                className="block text-sm font-medium text-white"
              >
                Player Character:
              </label>
              <Select
                id="playerCharacter"
                name="playerCharacter"
                value={characterOptionsWithAvatars.find(option => option.value === selectedCharacter.id)}
                onChange={(option) => {
                  const newCharacter = characterOptions.find(character => character.id === option?.value);
                  if (newCharacter) {
                    setSelectedCharacter(newCharacter);
                    setPlayerCharacter(newCharacter.id);
                  }
                }}
                options={characterOptionsWithAvatars}
                styles={customStyles}
                className="pb-1 pt-1 block w-full border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4 flex justify-center">
              <Avatar.Root className="AvatarRoot">
                <Avatar.Image
                  className="AvatarImage"
                  src={selectedCharacter.avatarSrc}
                  alt={selectedCharacter.name}
                  style={{ ...pixelArtStyle, imageRendering: "pixelated" }}
                />
                <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                  {selectedCharacter.name.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
            </div>
            <div className="mb-4">
              <label
                htmlFor="maxPlayerCount"
                className="block text-sm font-medium text-white"
              >
                Max Player Count:
              </label>
              <input
                type="number"
                id="maxPlayerCount"
                name="maxPlayerCount"
                min={5}
                max={10}
                value={maxPlayerCount}
                onChange={(e) => setMaxPlayerCount(parseInt(e.target.value))}
                className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="maxKillerCount"
                className="block text-sm font-medium text-white"
              >
                Killer Count:
              </label>
              <input
                type="number"
                id="maxKillerCount"
                name="maxKillerCount"
                min={1}
                max={Math.floor(maxPlayerCount / 3)}
                value={maxKillerCount}
                onChange={(e) => setMaxKillerCount(parseInt(e.target.value))}
                className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white"
              />
            </div>
            <div className="mb-4">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="isPrivate"
                className="text-sm font-medium text-white"
              >
                Private Lobby
              </label>
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Lobby
            </button>
          </form>
        </div>
      </Container>
    </Theme>
  );
}
