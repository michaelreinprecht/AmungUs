import MainMenuNavButton from "../MainMenuNavButton";

export default function MainMenuScene() {
  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Host Game Button */}
      <MainMenuNavButton
        text="Host Game"
        image="/character-logo.png"
        link="/menu/createLobby"
      />

      {/* Public Game Button */}
      <MainMenuNavButton
        text="Public Game"
        image="/character-logo.png"
        link="/menu/selectLobby"
      />

      {/* Private Game Button */}
      <MainMenuNavButton
        text="Join Game"
        image="/character-logo.png"
        link="/menu/joinLobby"
      />
    </div>
  );
}
