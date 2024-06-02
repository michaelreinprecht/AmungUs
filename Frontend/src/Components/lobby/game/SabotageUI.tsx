import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { serverAddress } from "@/app/globals";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

type SabotageUIProps = {
  isSabotageEnabled: boolean | undefined;
  activePlayerName: string;
  lobbyCode: string;
};

export default function SabotageUI({
  isSabotageEnabled,
  activePlayerName,
  lobbyCode,
}: SabotageUIProps) {

function handleSabotage() {
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
        cursor: isSabotageEnabled ? "pointer" : "not-allowed",
      }}
      onClick={handleSabotage}
    >
      <img
        src="/SabotageUI.png"
        alt="UI Element"
        style={{
          width: 100,
          height: 100,
          opacity: isSabotageEnabled ? 1 : 0.5, // Lower opacity if Sabotage is disabled
        }}
      />
    </div>
  );
}
