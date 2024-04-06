package com.example.messagingstompwebsocket;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class Lobby {
    private String lobbyCode;
    private PlayerPositions playerPositions;

    public void updatePlayerPosition(PlayerPosition playerPosition) {
        if (playerPositions.getPlayerPositions() == null) {
            playerPositions.setPlayerPositions(new ArrayList<>());
        }

        // Check if the player already exists in the lobby
        boolean playerExists = false;
        for (PlayerPosition existingPlayer : playerPositions.getPlayerPositions()) {
            if (existingPlayer.getPlayerName().equals(playerPosition.getPlayerName())) {
                // Update the player's position
                existingPlayer.setPlayerPositionX(playerPosition.getPlayerPositionX());
                existingPlayer.setPlayerPositionY(playerPosition.getPlayerPositionY());
                playerExists = true;
                break;
            }
        }
        // If the player doesn't exist in the lobby, add them
        if (!playerExists) {
            playerPositions.getPlayerPositions().add(playerPosition);
        }
    }
}
