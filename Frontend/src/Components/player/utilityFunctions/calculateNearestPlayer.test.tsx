import { it, expect } from "vitest";
import { PlayerInfo } from "../../../app/types";
import { calculateNearestVictim } from "./calculateNearestPlayer";

it("Can calculate nearest player", () => {
  //Arrange
  const playerPositions: PlayerInfo[] = [
    {
      playerName: "MyPlayer",
      playerPositionX: 20,
      playerPositionY: 20,
      alive: true,
      playerRole: "killer",
      killedPlayerPositionX: 0,
      killedPlayerPositionY: 0,
      corpseFound: false,
    },
    {
      playerName: "ClosestPlayer",
      playerPositionX: 30,
      playerPositionY: 30,
      alive: true,
      playerRole: "crewmate",
      killedPlayerPositionX: 0,
      killedPlayerPositionY: 0,
      corpseFound: false,
    },
    {
      playerName: "FurtherPlayer",
      playerPositionX: 50,
      playerPositionY: 50,
      alive: true,
      playerRole: "crewmate",
      killedPlayerPositionX: 0,
      killedPlayerPositionY: 0,
      corpseFound: false,
    },
  ];

  // Act
  const nearestPlayer = calculateNearestVictim(playerPositions, "MyPlayer");

  // Assert
  expect(nearestPlayer).toBe("ClosestPlayer");
});
