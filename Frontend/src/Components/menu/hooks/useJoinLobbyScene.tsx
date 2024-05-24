import { serverAddress } from "@/app/globals";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useJoinLobbyScene() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lobbyCode = formData.get("lobbyCode") as string;
    if (await checkIfLobbyExists(lobbyCode)) {
      router.push(`/lobby/${lobbyCode}`);
    }
  }

  async function checkIfLobbyExists(lobbyCode: string) {
    try {
      const response = await fetch(
        `http://${serverAddress}:8080/api/lobby/${lobbyCode}`
      );
      if (!response.ok) {
        throw Error("Failed to fetch lobby data");
      }
      const lobbyData = await response.json();
      if (lobbyData.lobbyCode === lobbyCode) {
        return true;
      }
    } catch (error) {
      setErrorMessage("Lobby could not be found.");
      return false;
    }
  }

  return { onSubmit, errorMessage };
}
