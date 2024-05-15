type VotingKillUIProps = {
  votingKill: string;
};

export default function VotingKillUI({ votingKill }: VotingKillUIProps) {
  return (
    <>
      {votingKill === "" ? null : (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-red-600 font-bold">
          Player {votingKill} was voted out!
        </div>
      )}
    </>
  );
}
