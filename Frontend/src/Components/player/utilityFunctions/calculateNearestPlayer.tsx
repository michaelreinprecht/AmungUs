import { PlayerPosition } from "../../../app/types";

export function calculateNearestVictim(
  playerPositions: PlayerPosition[],
  activePlayerName: string
) {
  const currentPlayerPosition = playerPositions.find(
    (pos) => pos.playerName === activePlayerName
  );

  if (!currentPlayerPosition) return null;

  let nearestPlayer: string | null = null;
  let nearestDistanceSquared = Infinity;

  for (const pos of playerPositions) {
    if (pos.playerName !== activePlayerName && pos.playerRole === "crewmate") {
      const distanceSquared =
        Math.pow(
          pos.playerPositionX - currentPlayerPosition.playerPositionX,
          2
        ) +
        Math.pow(
          pos.playerPositionY - currentPlayerPosition.playerPositionY,
          2
        );

      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
        nearestPlayer = pos.playerName;
      }
    }
  }

  return nearestPlayer;
}
