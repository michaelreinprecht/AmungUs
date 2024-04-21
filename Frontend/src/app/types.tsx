export type PlayerPosition = {
  playerName: string;
  playerPositionX: number;
  playerPositionY: number;
  alive: boolean;
  playerRole: "killer" | "crewmate";
};

export type Movement = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export type PlayerRole = "killer" | "crewmate";
