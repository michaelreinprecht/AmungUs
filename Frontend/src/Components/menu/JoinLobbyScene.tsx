"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

export default function JoinLobbyScene() {
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lobbyCode = formData.get("lobbyCode") as string;
    router.push(`/lobby/${lobbyCode}`);
  }

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center">
      <div className="mx-auto bg-gray-900 p-6 rounded-lg shadow-lg w-1/4">
        <h1 className="text-3xl font-bold text-white mb-4">Join Lobby</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="lobbyCode"
              className="block text-sm font-medium text-white"
            >
              Lobby Code:
            </label>
            <input
              type="text"
              id="lobbyCode"
              name="lobbyCode"
              className="mt-1 p-2 block w-full bg-gray-800 border-gray-700 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Join Lobby
          </button>
        </form>
      </div>
    </div>
  );
}
