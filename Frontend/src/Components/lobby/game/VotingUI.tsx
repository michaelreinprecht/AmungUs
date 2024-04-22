import React, { useEffect, useState } from "react";

type VotingUIProps = {
  setIsVotingActive: (isVotingActive: boolean) => void;
  setIsGamePaused: (isGamePaused: boolean) => void;
};

export default function VotingUI({
  setIsVotingActive,
  setIsGamePaused,
}: VotingUIProps) {
  const [timer, setTimer] = useState(10); // Initial timer value

  function stopVoting() {
    setIsVotingActive(false); //Stop the voting
    setIsGamePaused(false); //Resume the game
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1); // Decrease timer by 1 every second
    }, 1000);

    // Clean up the interval when component unmounts or when timer reaches 0
    return () => clearInterval(timerInterval);
  }, []);

  // Call stopVoting function after 10 seconds
  useEffect(() => {
    if (timer === 0) {
      stopVoting();
    }
  }, [timer]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center">
      <h1 className="text-white text-xl mb-4">
        Just a placeholder for the real voting UI
      </h1>
      <p className="text-white text-lg mb-2">Remaining voting time: {timer}</p>{" "}
      {/* Display timer here */}
      <button
        onClick={stopVoting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md focus:outline-none focus:shadow-outline"
      >
        Skip
      </button>
    </div>
  );
}
