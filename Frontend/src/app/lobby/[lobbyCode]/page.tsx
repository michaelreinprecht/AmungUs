"use client";

import LobbyScene from "@/Components/lobby/scenes/LobbyScene";
import { useEffect } from "react";

type LobbyPageProps = {
  params: {
    lobbyCode: string;
  };
};

export default function LobbyPage({ params }: LobbyPageProps) {
  //TODO: Remove after testing is done
  useEffect(() => {
    console.log("Use effect called in LobbyPage");
  }, []);

  return <LobbyScene lobbyCode={params.lobbyCode} />;
}
