"use client";

import React from "react";
import LobbyListItem from "../LobbyListItem";
import useSelectLobbyScene from "../hooks/useSelectLobbyScene";

export type Lobby = {
  lobbyCode: string;
  isGameRunning: boolean;
  playerCount: number;
  maxPlayerCount: number;
};

export default function SelectLobbyScene() {
  const { lobbies, fetchLobbies } = useSelectLobbyScene();

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
