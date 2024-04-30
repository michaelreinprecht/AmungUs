package lobbyService.lobby.models;

import lobbyService.player.models.PlayerInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Getter
@Setter
public class Lobby {

    private static final Logger logger = LogManager.getLogger(Lobby.class);

    private String lobbyCode;
    private List<PlayerInfo> playerInfos;
    private boolean isGameRunning;
    private boolean isVoting;
    private int playerCount;
    private int maxPlayerCount;
    private int killerCount;
    private int maxKillerCount;
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
        this.killerCount = 0;
        this.executor = Executors.newSingleThreadScheduledExecutor(); // Initialize the executor
    }

    public void updatePlayerInfo(PlayerInfo playerInfo) {
        // Check if the player already exists in the lobby
        boolean playerExists = false;
        for (PlayerInfo existingPlayer : playerInfos) {
            if (existingPlayer.getPlayerName().equals(playerInfo.getPlayerName())) {
                updateExistingPlayer(existingPlayer, playerInfo);
                playerExists = true;
                break;
            }
        }
        // If the player doesn't exist in the lobby, add them
        if (!playerExists) {
            addPlayerToLobby(playerInfo);
        }
    }

    public void startHeartbeatChecking() {
        if (executor.isShutdown()) {
            executor = Executors.newSingleThreadScheduledExecutor(); // Reinitialize the executor if it's shutdown
        }
        executor.scheduleAtFixedRate(this::checkPlayerHeartbeats, 0, 10, TimeUnit.SECONDS); // Run every 10 seconds
    }

    // Method to stop periodic checking of player heartbeats -> called once lobby is removed
    public void stopHeartbeatChecking() {
        executor.shutdown();
    }

    // Method to periodically check player heartbeats and remove inactive players from the lobby
    private void checkPlayerHeartbeats() {
        try {
            logger.debug("Checking player heartbeats for lobby: {}", lobbyCode);
            Instant now = Instant.now();
            Iterator<PlayerInfo> iterator = playerInfos.iterator();
            while (iterator.hasNext()) {
                PlayerInfo playerInfo = iterator.next();
                Instant lastHeartbeat = playerInfo.getLastHeartbeat();
                logger.debug("Last heartbeat: {}", lastHeartbeat.toString());
                if (lastHeartbeat != null && Duration.between(lastHeartbeat, now).getSeconds() > 10) {
                    logger.info("Player {} has lost heartbeat", playerInfo.getPlayerName());
                    playerCount--;
                    if (playerInfo.getPlayerRole().equals("killer")) {
                        killerCount--;
                    }
                    iterator.remove(); // Safely remove the playerInfo from the list
                    if (playerInfos.isEmpty()) {
                        notifyEmptyListener();
                    }
                }
            }
        } catch (Exception e) {
            logger.info("Error checking player heartbeats: {}", e.getMessage());
        }
    }

    // Method to notify listener when lobby becomes empty
    private void notifyEmptyListener() {
        if (emptyListener != null) {
            logger.debug("Notifying empty listener");
            stopHeartbeatChecking();
            emptyListener.onLobbyEmpty(lobbyCode);
        }
    }

    // Interface for lobby empty notification
    public interface LobbyEmptyListener {
        void onLobbyEmpty(String lobbyCode);
    }

    // Returns the player info for the given name, if it exists
    public PlayerInfo getPlayerInfoForName(String playerName) {
        for (PlayerInfo playerInfo : playerInfos) {
            if (playerInfo.getPlayerName().equals(playerName)) {
                return playerInfo;
            }
        }
        return null;
    }

    //Kill the given player
    public void killPlayer(PlayerInfo victim) {
        for (PlayerInfo playerInfo : playerInfos) {
            if (playerInfo.getPlayerName().equals(victim.getPlayerName())) {
                playerInfo.setAlive(false);
                playerInfo.setKilledPlayerPositionX(victim.getPlayerPositionX());
                playerInfo.setKilledPlayerPositionY(victim.getPlayerPositionY());
                logger.info("Player {} was killed", victim.getPlayerName());
            }
        }
    }

    public void teleportPlayersToSpawn() {
        for (PlayerInfo playerInfo : playerInfos) {
            playerInfo.setPlayerPositionX((float)(Math.random()-0.5)*20);
            playerInfo.setPlayerPositionY((float)(Math.random()-0.5)*20);
        }
    }

    //Remove the corpse for all players once it's been found
    public void removeCorpse() {
        for (PlayerInfo playerInfo : playerInfos) {
            if (!playerInfo.isAlive()) {
                playerInfo.setCorpseFound(true);
                logger.info("Corpse of player {} was removed", playerInfo.getPlayerName());
            }
        }
    }

    private void updateExistingPlayer(PlayerInfo existingPlayer, PlayerInfo updatedPlayer) {
        // Update the player's position
        existingPlayer.setPlayerPositionX(updatedPlayer.getPlayerPositionX());
        existingPlayer.setPlayerPositionY(updatedPlayer.getPlayerPositionY());
        existingPlayer.setAlive(updatedPlayer.isAlive());
        existingPlayer.setLastHeartbeat(updatedPlayer.getLastHeartbeat()); //Update the heartbeat once player info is updated

        logger.debug("ExistingPlayer{}", existingPlayer);
    }

    private void addPlayerToLobby(PlayerInfo playerInfo) {
        //Set default values for playerInfo
        playerInfo.setToDefault();

        //Increase player count and add player to playerInfos list
        playerCount++;
        playerInfos.add(playerInfo);
        //If the new player got killer role, increase killerCount by 1
        if (Objects.equals(playerInfo.getPlayerRole(), "killer")) {
            killerCount++;
        }
    }
}
