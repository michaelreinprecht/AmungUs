"use client";

import React, { useState } from "react";

export default function CreateLobbyPage() {
  const [lobbyCode, setLobbyCode] = useState("1");
  const [maxPlayerCount, setMaxPlayerCount] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);

  async function createLobby(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Creating lobby");
    const url = "http://localhost:8080/api/lobby/createLobby";
    const requestBody = {
      lobbyCode: lobbyCode,
      maxPlayerCount: maxPlayerCount,
      isPrivate: isPrivate,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create lobby");
      }

      // Lobby created successfully
      console.log("Lobby created successfully");

      // You may want to do something with the response data if any
      // For example, you can access response.json() to get JSON data from the response
    } catch (error) {
      console.error("Error creating lobby:", error);
      // Handle errors here
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center">
      <div className="mx-auto bg-gray-900 p-6 rounded-lg shadow-lg w-1/4">
        <h1 className="text-3xl font-bold text-white mb-4">Create Lobby</h1>
        <form onSubmit={createLobby}>
          <div className="mb-4">
            <label
              htmlFor="lobbyName"
              className="block text-sm font-medium text-white"
            >
              Lobby Name:
            </label>
            <input
              type="text"
              id="lobbyName"
              name="lobbyName"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value)}
              className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
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
