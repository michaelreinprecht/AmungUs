package com.example.messagingstompwebsocket.lobby;

import com.example.messagingstompwebsocket.player.PlayerInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Getter
@Setter
public class Lobby {
    private String lobbyCode;
    private List<PlayerInfo> playerInfos;
    private boolean isGameRunning;
    private int playerCount;
    private int maxPlayerCount;
    private boolean isPrivate;

    @JsonIgnore
    private transient ScheduledExecutorService executor; // Scheduled executor service for heartbeat checking task
    @JsonIgnore
    private transient LobbyEmptyListener emptyListener; // Listener for empty lobby notification

    public Lobby() {
        this.playerInfos = new ArrayList<>();
        this.isGameRunning = false; //TODO set this once the lobby is created, and allow no more players to join
        this.isPrivate = false; //TODO set this once the lobby is created, depending on if lobby is private
        this.playerCount = 0;
        this.executor = Executors.newSingleThreadScheduledExecutor(); // Initialize the executor
    }

    public void updatePlayerInfo(PlayerInfo playerInfo) {
        // Check if the player already exists in the lobby
        boolean playerExists = false;
        for (PlayerInfo existingPlayer : playerInfos) {
            if (existingPlayer.getPlayerName().equals(playerInfo.getPlayerName())) {
                // Update the player's position
                existingPlayer.setPlayerPositionX(playerInfo.getPlayerPositionX());
                existingPlayer.setPlayerPositionY(playerInfo.getPlayerPositionY());
                existingPlayer.setLastHeartbeat(playerInfo.getLastHeartbeat()); //Update the heartbeat once player info is updated
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

    public void startHeartbeatChecking() {
        if (executor.isShutdown()) {
            executor = Executors.newSingleThreadScheduledExecutor(); // Reinitialize the executor if it's shutdown
        }
        executor.scheduleAtFixedRate(this::checkPlayerHeartbeats, 0, 10, TimeUnit.SECONDS); // Run every 10 seconds
    }

    // Method to stop periodic checking of player heartbeats, TODO: call once lobby is removed!
    public void stopHeartbeatChecking() {
        executor.shutdown();
    }

    // Method to periodically check player heartbeats and remove inactive players from the lobby
    private void checkPlayerHeartbeats() {
        try {
            System.out.println("Checking player heartbeats for lobby: " + lobbyCode);
            Instant now = Instant.now();
            Iterator<PlayerInfo> iterator = playerInfos.iterator();
            while (iterator.hasNext()) {
                PlayerInfo playerInfo = iterator.next();
                Instant lastHeartbeat = playerInfo.getLastHeartbeat();
                System.out.println("Last heartbeat: " + lastHeartbeat.toString());
                System.out.println("Now: " + now.toString());
                if (lastHeartbeat != null && Duration.between(lastHeartbeat, now).getSeconds() > 10) {
                    System.out.println("Player " + playerInfo.getPlayerName() + " has lost heartbeat");
                    playerCount--;
                    iterator.remove(); // Safely remove the playerInfo from the list
                    if (playerInfos.isEmpty()) {
                        notifyEmptyListener();
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error checking player heartbeats: " + e.getMessage());
        }
    }

    // Method to notify listener when lobby becomes empty
    private void notifyEmptyListener() {
        if (emptyListener != null) {
            System.out.println("Notifying empty listener");
            stopHeartbeatChecking();
            emptyListener.onLobbyEmpty(lobbyCode);
        }
    }

    // Interface for lobby empty notification
    public interface LobbyEmptyListener {
        void onLobbyEmpty(String lobbyCode);
    }
}
