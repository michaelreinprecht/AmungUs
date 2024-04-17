export type PlayerPosition = {
    playerName: string;
    playerPositionX: number;
    playerPositionY: number;
    alive: boolean;
    playerRole: "killer" | "crewmate";
  };