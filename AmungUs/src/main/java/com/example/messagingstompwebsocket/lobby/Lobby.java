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
    private boolean isGameRunning;
    private int playerCount;
    private int maxPlayerCount;

    public Lobby() {
        this.playerInfos = new ArrayList<>();
        this.isGameRunning = false; //TODO set this once the game starts, and allow no more players to join
        this.playerCount = 0;
    }

    public void updatePlayerInfo(PlayerInfo playerInfo) {
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
            //Increase player count and add player to playerInfos list
            playerCount++;
            playerInfos.add(playerInfo);
        }
    }

    //TODO: remove players from playerInfos once they leave the lobby and decrease playerCount! If playerCount hits 0 remove the lobby.
}
