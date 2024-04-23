import React, { useEffect, useState } from "react";
import { useVotingUI } from "./hooks/useVotingUI";
import { votingTimer } from "@/app/globals";
import { sendIsVotingRequest } from "@/Components/utilityFunctions/webSocketHandler";

type VotingUIProps = {
  setIsVotingActive: (isVotingActive: boolean) => void;
  setIsGamePaused: (isGamePaused: boolean) => void;
  lobbyCode: string;
};

export default function VotingUI({
  setIsVotingActive,
  setIsGamePaused,
  lobbyCode,
}: VotingUIProps) {
  const { timer, stopVoting } = useVotingUI(
    votingTimer, //Using global value
    setIsVotingActive,
    setIsGamePaused,
    lobbyCode
  );

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center">
      <h1 className="text-white text-xl mb-4">
        Just a placeholder for the real voting UI
      </h1>
      <p className="text-white text-lg mb-2">Remaining voting time: {timer}</p>{" "}
      <button
        onClick={stopVoting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md focus:outline-none focus:shadow-outline"
      >
        Skip
      </button>
    </div>
  );
}
