export type PlayerPosition = {
  playerName: string;
  playerPositionX: number;
  playerPositionY: number;
  killedPlayerPositionX: number;
  killedPlayerPositionY: number;
  alive: boolean;
  corpseFound: boolean;
  playerRole: "killer" | "crewmate";
};

export type VotingPlayerInfo = {
  playerName: string;
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

export type PlayerRole = "killer" | "crewmate";
