import { useEffect, useState } from "react";

export interface Lobby {
  lobbyCode: string;
  isGameRunning: boolean;
  playerCount: number;
  maxPlayerCount: number;
}

export default function useSelectLobbyScene() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    fetchLobbies();
  }, []);

  async function fetchLobbies() {
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
  }

  return { lobbies, fetchLobbies };
}