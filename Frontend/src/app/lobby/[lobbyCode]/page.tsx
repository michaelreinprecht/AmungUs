"use client";

import LobbyScene from "@/Components/lobby/scenes/LobbyScene";

type LobbyPageProps = {
  params: {
    lobbyCode: string;
  };
};

export default function LobbyPage({ params }: LobbyPageProps) {
  return <LobbyScene lobbyCode={params.lobbyCode} />;
}
