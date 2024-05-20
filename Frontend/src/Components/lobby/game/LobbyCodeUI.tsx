type LobbyCodeUIProps = {
  lobbyCode: string;
};

export default function LobbyCodeUI({ lobbyCode }: LobbyCodeUIProps) {
  return (
    <>
      <div className="lobby-code absolute top-2 right-2 p-2 bg-gray-700 text-white text-2xl rounded">
        Lobby Code: {lobbyCode}
      </div>
    </>
  );
}
