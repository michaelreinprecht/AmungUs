import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { serverAddress } from "@/app/globals";

type SabotageUIProps = {
  sabotageCooldown: number;
  setSabotageCooldown: React.Dispatch<React.SetStateAction<number>>;
  activePlayerName: string;
  lobbyCode: string;
};

export default function SabotageUI({
  sabotageCooldown,
  setSabotageCooldown,
  activePlayerName,
  lobbyCode,
}: SabotageUIProps) {

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sabotageCooldown > 0) {
      timer = setInterval(() => {
        setSabotageCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [sabotageCooldown]);

  function handleSabotage() {
    if (sabotageCooldown > 0) {
      return;
    }
    const sabotageClient = new Client({
      brokerURL: `ws://${serverAddress}:8085/sabotageService`,
      onConnect: () => {
        sabotageClient.publish({
          destination: `/sabotageApp/initiateSabotage/${lobbyCode}`,
          body: JSON.stringify(true),
        });
      },
    });
    sabotageClient.activate();
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 125,
        cursor: sabotageCooldown === 0 ? "pointer" : "not-allowed",
      }}
      onClick={handleSabotage}
    >
      <img
        src="/SabotageUI.png"
        alt="UI Element"
        style={{
          width: 100,
          height: 100,
          opacity: sabotageCooldown === 0 ? 1 : 0.5, // Lower opacity if Sabotage is on cooldown
        }}
      />
     
    </div>
  );
}


