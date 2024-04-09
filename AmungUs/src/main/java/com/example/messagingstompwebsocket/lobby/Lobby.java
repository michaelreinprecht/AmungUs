package com.example.messagingstompwebsocket.lobby;

import com.example.messagingstompwebsocket.player.PlayerInfo;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Lobby {
    private String lobbyCode;
    private List<PlayerInfo> playerInfos;

    public Lobby() {
        this.playerInfos = new ArrayList<>();
    }

    public void updatePlayerPosition(PlayerInfo playerInfo) {
        // Check if the player already exists in the lobby
        boolean playerExists = false;
        for (PlayerInfo existingPlayer : playerInfos) {
            if (existingPlayer.getPlayerName().equals(playerInfo.getPlayerName())) {
                // Update the player's position
                existingPlayer.setPlayerPositionX(playerInfo.getPlayerPositionX());
                existingPlayer.setPlayerPositionY(playerInfo.getPlayerPositionY());
                playerExists = true;
                break;
            }
        }
        // If the player doesn't exist in the lobby, add them
        if (!playerExists) {
            playerInfos.add(playerInfo);
        }
    }
}
