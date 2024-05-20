import { getLobbyByCode } from "@/Components/utilityFunctions/APIService";
import { PlayerInfo, PlayerRole } from "../../../app/types";
import { useThree } from "@react-three/fiber";

export function getUpdatedPlayerPosition(
  delta: number,
  activePlayerName: string,
  movement: any,
  bounds: any,
  scale: number,
  playerPositions: PlayerInfo[]
) {
  const speed = 30 * delta;
  const { forward, backward, left, right } = movement;

  const playerPosition = getPositionOfPlayer(playerPositions, activePlayerName);

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
        killedPlayerPositionX: playerPosition.killedPlayerPositionX,
        killedPlayerPositionY: playerPosition.killedPlayerPositionY,
        alive: playerPosition.alive,
        playerRole: playerPosition.playerRole,
      };
      return updatedPlayerPosition;
    }
  } else {
    console.log("Unable to find player position for given name");
  }
}

export function getPositionOfPlayer(
  playerPositions: PlayerInfo[],
  playerName: string
) {
  const playerPosition = playerPositions.find(
    (pos) => pos.playerName === playerName
  );
  return playerPosition;
}

export async function getPlayerSpawnInfo(
  lobbyCode: string,
  activePlayerName: string,
  activePlayerCharacter: string
) {
  const lobbyData = await getLobbyByCode(lobbyCode);
  console.log("MaxKillerCount: " + lobbyData.maxKillerCount);
  console.log("KillerCount: " + lobbyData.killerCount);
  console.log("MaxPlayerCount: " + lobbyData.maxPlayerCount);
  console.log("PlayerCount: " + lobbyData.playerCount);

  let playerRole: PlayerRole = "crewmate";
  if (lobbyData.killerCount < lobbyData.maxKillerCount) {
    if (
      lobbyData.maxPlayerCount - lobbyData.playerCount <=
      lobbyData.maxKillerCount - lobbyData.killerCount
    ) {
      playerRole = "killer";
    } else {
      playerRole = Math.random() > 0.7 ? "killer" : "crewmate";
    }
  } else {
    playerRole = "crewmate";
  }

  const spawnInfo = {
    playerName: activePlayerName,
    playerCharacter: activePlayerCharacter,
    playerPositionX: (Math.random() - 0.5) * 20 + 27,
    playerPositionY: (Math.random() - 0.5) * 20 + 100,
    killedPlayerPositionX: null,
    killedPlayerPositionY: null,
    alive: true,
    playerRole: playerRole,
  };

  return spawnInfo;
}
