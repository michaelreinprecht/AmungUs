import { it, expect } from "vitest";
import { PlayerPosition } from "../../../app/types";
import { calculateNearestVictim } from "./calculateNearestPlayer";

it("Can calculate nearest player", () => {
  //Arrange
  const playerPositions: PlayerPosition[] = [
    {
      playerName: "MyPlayer",
      playerPositionX: 20,
      playerPositionY: 20,
      alive: true,
      playerRole: "killer",
    },
    {
      playerName: "ClosestPlayer",
      playerPositionX: 30,
      playerPositionY: 30,
      alive: true,
      playerRole: "crewmate",
    },
    {
      playerName: "FurtherPlayer",
      playerPositionX: 50,
      playerPositionY: 50,
      alive: true,
      playerRole: "crewmate",
    },
  ];

  // Act
  const nearestPlayer = calculateNearestVictim(playerPositions, "MyPlayer");

  // Assert
  expect(nearestPlayer).toBe("ClosestPlayer");
});
