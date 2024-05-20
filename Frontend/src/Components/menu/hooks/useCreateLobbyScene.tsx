import { useState } from "react";
import { useRouter } from "next/navigation";
import { characterOptions } from "@/app/globals";

export default function useCreateLobbyScene() {
  const [playerName, setPlayerName] = useState("");
  const [playerCharacter, setPlayerCharacter] = useState(
    characterOptions[0].id
  );
  const [maxPlayerCount, setMaxPlayerCount] = useState(5);
  const [maxKillerCount, setMaxKillerCount] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  async function createLobby(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission behavior

    const url = "http://localhost:8080/api/lobby/createLobby";
    const requestBody = {
      maxPlayerCount: maxPlayerCount,
      maxKillerCount: maxKillerCount,
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

      const data = await response.json();
      // Lobby created successfully
      router.push(
        `/lobby/${data.lobbyCode}?initialPlayerName=${playerName}&initialPlayerCharacter=${playerCharacter}`
      );
    } catch (error) {
      console.error("Error creating lobby:", error);
    }
  }

  return {
    maxKillerCount,
    maxPlayerCount,
    isPrivate,
    playerName,
    playerCharacter,
    setMaxPlayerCount,
    setMaxKillerCount,
    setIsPrivate,
    setPlayerName,
    setPlayerCharacter,
    createLobby,
  };
}
