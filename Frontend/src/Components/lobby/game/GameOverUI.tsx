import { GameOverInfo } from "@/app/types";
import { useEffect } from "react";

type GameOverUIProps = {
  winners: GameOverInfo;
  setWinners: (winner: GameOverInfo) => void;
  setIsGameOver: (isGameOver: boolean) => void;
};

export default function GameOverUI({
  winners,
  setWinners,
  setIsGameOver,
}: GameOverUIProps) {
  useEffect(() => {
    if (winners.winner !== "") {
      setIsGameOver(true);
      const timer = setTimeout(() => {
        setIsGameOver(false);
        setWinners({ winner: "", teamMembers: [] });
      }, 5000);

      // Clear the timer if the component unmounts or if winner changes
      return () => clearTimeout(timer);
    }
  }, [winners, setWinners]);

  const backgroundImageUrl =
    winners.winner === "killer"
      ? "/killerWin-background.png"
      : "/crewmatesWin-background.png";

  return (
    <>
      {winners.winner === "" ? null : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="p-8 rounded-lg text-center">
            <div className="text-4xl text-white mt-4 p-14">
              <ul className="mt-4 flex justify-center items-center space-x-6">
                {winners.teamMembers.map((teamMember, index) => (
                  <li key={index} className="flex flex-col items-center">
                    <img
                      src={`/playericon.png`}
                      alt={teamMember.playerName}
                      className="w-40 h-40 rounded-full"
                    />
                    <span>{teamMember.playerName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
