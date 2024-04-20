"use client";

import React, { useEffect, useState } from "react";
import LobbyListItem from "../LobbyListItem";

export type Lobby = {
  lobbyCode: string;
  //playerInfo -> might need at some point
  isGameRunning: boolean;
  playerCount: number;
  maxPlayerCount: number;
};

export default function SelectLobbyScene() {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    fetchLobbies();
  }, []);

  const fetchLobbies = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/lobby/getPublicLobbies"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch lobbies");
      }
      const lobbiesData = await response.json();
      setLobbies(lobbiesData);
    } catch (error) {
      console.error("Error fetching lobbies:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-14 border border-gray-700 h-screen">
      <button
        className="bg-gray-700 text-white px-4 py-2 mb-4 rounded-md shadow-md hover:bg-gray-600"
        onClick={fetchLobbies}
      >
        Refresh
      </button>
      {lobbies != undefined &&
        lobbies.map((lobby: Lobby) => (
          <LobbyListItem key={lobby.lobbyCode} lobby={lobby} />
        ))}
    </div>
  );
}
