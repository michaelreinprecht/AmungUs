"use client";

import Lobby from "@/Components/Lobby";

type LobbyPageProps = {
  params: {
    lobbyCode: string;
  };
};

export default function LobbyPage({ params }: LobbyPageProps) {
  return <Lobby lobbyCode={params.lobbyCode} />;
}
