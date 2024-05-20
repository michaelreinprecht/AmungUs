export type PlayerInfo = {
  playerName: string;
  playerCharacter: string;
  playerPositionX: number;
  playerPositionY: number;
  killedPlayerPositionX: number;
  killedPlayerPositionY: number;
  lastKillTime: string;
  alive: boolean;
  corpseFound: boolean;
  isHost: boolean;
  playerRole: "killer" | "crewmate";
};

export type VotingPlayerInfo = {
  playerName: string;
  playerCharacter: string;
  alive: boolean;
  votes: Set<string>;
  voteCount: number;
};

export type VotingRequest = {
  votingPlayerName: string;
  votedPlayerName: string;
};

export type Movement = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export type RectangleCollider = {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
};

export type PlayerRole = "killer" | "crewmate";

export type Task = {
  id: number;
  name: string;
  completed: boolean;
};

export type GameOverInfo = {
  winner: string;
  teamMembers: PlayerInfo[];
};
