import React from "react";
import { useVotingUI } from "./hooks/useVotingUI";
import { votingTimer } from "@/app/globals";
import { VotingPlayerInfo } from "@/app/types";

type VotingUIProps = {
  lobbyCode: string;
  activePlayerName: string;
};

export default function VotingUI({
  lobbyCode,
  activePlayerName,
}: VotingUIProps) {
  const { timer, stopVoting, votingPlayerInfos, updateVote } = useVotingUI(
    votingTimer, //Using global value
    lobbyCode,
    activePlayerName
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
        Skip Voting
      </button>
      <div className="flex flex-col">
        {votingPlayerInfos.map((playerInfo: VotingPlayerInfo) => (
          <button
            onClick={() => updateVote(playerInfo.playerName)}
            key={playerInfo.playerName}
            className={`text-white font-bold py-2 px-4 rounded-full shadow-md mb-2 ${
              playerInfo.alive
                ? "bg-green-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!playerInfo.alive}
          >
            {playerInfo.playerName} - Votes: {playerInfo.voteCount} - Votes:{" "}
            {Array.from(playerInfo.votes).join(", ")}
          </button>
        ))}
      </div>
    </div>
  );
}
