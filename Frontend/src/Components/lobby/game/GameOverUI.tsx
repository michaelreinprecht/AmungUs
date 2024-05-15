import { GameOverInfo } from "@/app/types";
import { useEffect } from "react";

type GameOverUIProps = {
  winners: GameOverInfo;
  setWinners: (winner: GameOverInfo) => void;
  setIsGamePaused: (isGamePaused: boolean) => void;
};

export default function GameOverUI({
  winners,
  setWinners,
  setIsGamePaused,
}: GameOverUIProps) {
  useEffect(() => {
    if (winners.winner !== "") {
      console.log("Paused game");
      setIsGamePaused(true);
      const timer = setTimeout(() => {
        setIsGamePaused(false);
        setWinners({ winner: "", teamMembers: [] });
      }, 5000);

      // Clear the timer if the component unmounts or if winner changes
      return () => clearTimeout(timer);
    }
  }, [winners, setWinners]);

  return (
    <>
      {winners.winner === "" ? null : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-red-600 font-bold">
          <div>Game Over, {winners.winner}s have won!</div>
          <div className="text-4xl text-white mt-4">
            Winning team members:
            <ul>
              {winners.teamMembers.map((teamMember, index) => (
                <li key={index}>{teamMember.playerName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
