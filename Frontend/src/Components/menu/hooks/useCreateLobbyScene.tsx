import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useCreateLobbyScene() {
  const [lobbyCode, setLobbyCode] = useState("");
  const [maxPlayerCount, setMaxPlayerCount] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  async function createLobby(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Creating lobby");
    const url = "http://localhost:8080/api/lobby/createLobby";
    const requestBody = {
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

      const data = await response.json();
      setLobbyCode(data.lobbyCode);
      // Lobby created successfully
      router.push(`/lobby/${data.lobbyCode}`);
    } catch (error) {
      console.error("Error creating lobby:", error);
    }
  }

  return {
    lobbyCode,
    maxPlayerCount,
    isPrivate,
    setMaxPlayerCount,
    setIsPrivate,
    createLobby,
  };
}
