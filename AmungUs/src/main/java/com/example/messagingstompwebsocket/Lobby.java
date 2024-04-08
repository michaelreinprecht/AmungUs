package com.example.messagingstompwebsocket;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Lobby {
    private String lobbyCode;
    private List<PlayerPosition> playerPositions;

    public Lobby() {
        this.playerPositions = new ArrayList<>();
    }

    public void updatePlayerPosition(PlayerPosition playerPosition) {
        // Check if the player already exists in the lobby
        boolean playerExists = false;
        for (PlayerPosition existingPlayer : playerPositions) {
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
            playerPositions.add(playerPosition);
        }
    }
}
