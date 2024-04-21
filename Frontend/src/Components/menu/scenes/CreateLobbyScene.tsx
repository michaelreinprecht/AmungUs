import React from "react";
import useCreateLobbyScene from "@/Components/menu/hooks/useCreateLobbyScene";

export default function CreateLobbyScene() {
  const {
    maxPlayerCount,
    isPrivate,
    setMaxPlayerCount,
    setIsPrivate,
    createLobby,
  } = useCreateLobbyScene();

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center">
      <div className="mx-auto bg-gray-900 p-6 rounded-lg shadow-lg w-1/4">
        <h1 className="text-3xl font-bold text-white mb-4">Create Lobby</h1>
        <form onSubmit={createLobby}>
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
              min={4}
              max={10}
              value={maxPlayerCount}
              onChange={(e) => setMaxPlayerCount(parseInt(e.target.value))}
              className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
    </div>
  );
}
