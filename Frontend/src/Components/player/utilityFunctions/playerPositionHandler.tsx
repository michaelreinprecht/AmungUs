import { PlayerPosition } from "../../../app/types";

export function getUpdatedPlayerPosition(
  delta: number,
  activePlayerName: string,
  movement: any,
  bounds: any,
  scale: number,
  playerPositions: PlayerPosition[]
) {
  const speed = 30 * delta;
  const { forward, backward, left, right } = movement;

  const playerPosition = getPositionOfCurrentPlayer(
    playerPositions,
    activePlayerName
  );

  if (playerPosition) {
    let newPositionX = playerPosition.playerPositionX;
    let newPositionY = playerPosition.playerPositionY;

      if (forward) newPositionY += speed;
      if (backward) newPositionY -= speed;
      if (left) newPositionX -= speed;
      if (right) {
        newPositionX += speed;
      }

      // Update position based on bounds
      if (
        newPositionX - scale / 2 >= bounds.minX &&
        newPositionX + scale / 2 <= bounds.maxX &&
        newPositionY - scale / 2 >= bounds.minY &&
        newPositionY + scale / 2 <= bounds.maxY
      ) {
        const updatedPlayerPosition = {
          playerName: activePlayerName,
          playerPositionX: newPositionX,
          playerPositionY: newPositionY,
          alive: playerPosition.alive,
          playerRole: playerPosition.playerRole,
        };
        return updatedPlayerPosition;
      }
  } else {
    console.log("Unable to find player position for given name");
  }
}

export function getPositionOfCurrentPlayer(
  playerPositions: PlayerPosition[],
  activePlayerName: string
) {
  const playerPosition = playerPositions.find(
    (pos) => pos.playerName === activePlayerName
  );
  return playerPosition;
}