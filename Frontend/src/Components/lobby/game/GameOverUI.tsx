import { useEffect } from "react";

type GameOverUIProps = {
  winner: string;
  setWinner: (winner: string) => void;
};

export default function GameOverUI({ winner, setWinner }: GameOverUIProps) {
  useEffect(() => {
    if (winner !== "") {
      const timer = setTimeout(() => {
        setWinner("");
      }, 5000);

      // Clear the timer if the component unmounts or if winner changes
      return () => clearTimeout(timer);
    }
  }, [winner, setWinner]);

  return (
    <>
      {winner === "" ? null : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-red-600 font-bold">
          Game Over, {winner} have won!
        </div>
      )}
    </>
  );
}
