type VotingUIProps = {
  setIsVotingActive: (isVotingActive: boolean) => void;
  setIsGamePaused: (isGamePaused: boolean) => void;
};

export default function VotingUI({
  setIsVotingActive,
  setIsGamePaused,
}: VotingUIProps) {
  function stopVoting() {
    setIsVotingActive(false); //Stop the voting
    setIsGamePaused(false); //Resume the game
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center">
      <h1 className="text-white text-xl mb-4">
        Just a placeholder for the real voting UI
      </h1>
      <button
        onClick={stopVoting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md focus:outline-none focus:shadow-outline"
      >
        Skip
      </button>
    </div>
  );
}
