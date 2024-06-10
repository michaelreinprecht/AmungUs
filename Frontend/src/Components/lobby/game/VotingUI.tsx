import React from "react";
import { useVotingUI } from "./hooks/useVotingUI";
import { votingTimer } from "@/app/globals";
import { VotingPlayerInfo } from "@/app/types";

type VotingUIProps = {
  lobbyCode: string;
  activePlayerName: string;
  activePlayerCharacter: string;
};

export default function VotingUI({
  lobbyCode,
  activePlayerName,
  activePlayerCharacter,
}: VotingUIProps) {
  const { timer, stopVoting, votingPlayerInfos, updateVote } = useVotingUI(
    votingTimer, //Using global value
    lobbyCode,
    activePlayerName,
    activePlayerCharacter
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center p-4 overflow-auto">
      <div className="bg-black border-2 border-white rounded-xl shadow-2xl p-4 w-full max-w-6xl mx-auto">
        <h2 className="font-mono text-center text-2xl text-white font-bold mb-6">
          Who Is The Imposter?
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
          {votingPlayerInfos.map((playerInfo) => (
            <div
              key={playerInfo.playerName}
              className={`flex flex-col items-center justify-center space-y-2 ${
                !playerInfo.alive && "opacity-50"
              }`}
            >
              <div className="text-white text-lg font-bold">
                {playerInfo.playerName}
              </div>
              <button
                onClick={() => updateVote(playerInfo.playerName)}
                className={`w-20 h-20 bg-green-600 rounded-full flex items-center justify-center p-1 overflow-hidden ${
                  playerInfo.alive
                    ? "hover:bg-green-700 shadow-lg"
                    : "cursor-not-allowed bg-gray-500"
                }`}
                disabled={!playerInfo.alive}
              >
                <img
                  src={`/${playerInfo.playerCharacter}-move-1.png`}
                  alt={`${activePlayerCharacter}-move-1.png`}
                  className="w-full h-full object-cover rounded-full"
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
              </button>
              <div className="text-gray-300 text-sm">
                Votes: {playerInfo.voteCount}
              </div>
              <div className="text-gray-400 text-xs">
                {playerInfo.votes
                  ? `Voted by: ${Array.from(playerInfo.votes).join(", ")}`
                  : "No votes"}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-lg">
            Remaining voting time: {timer}
          </p>
        </div>
      </div>
    </div>
  );
}
