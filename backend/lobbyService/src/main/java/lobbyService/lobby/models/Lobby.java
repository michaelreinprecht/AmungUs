package lobbyService.lobby.models;

import lobbyService.player.models.PlayerInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
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
        this.isPrivate = false;
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
            logger.info("Trying to call addPlayerToLobby");
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

    public void removePlayer(String playerName) {
        for (PlayerInfo playerInfo : playerInfos) {
            if (playerInfo.getPlayerName().equals(playerName)) {
                playerInfos.remove(playerInfo);
                playerCount--;
                if (playerInfo.getPlayerRole().equals("killer")) {
                    killerCount--;
                }
                if (playerInfos.isEmpty()) {
                    notifyEmptyListener();
                }
            }
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
    public void killPlayer(PlayerInfo victim, PlayerInfo killer) {
        for (PlayerInfo playerInfo : playerInfos) {
            if (playerInfo.getPlayerName().equals(victim.getPlayerName())) {
                playerInfo.setAlive(false);
                playerInfo.setKilledPlayerPositionX(victim.getPlayerPositionX());
                playerInfo.setKilledPlayerPositionY(victim.getPlayerPositionY());
                logger.info("Player {} was killed", victim.getPlayerName());
            }
        }
        if (killer != null) {
            for (PlayerInfo playerInfo : playerInfos) {
                if (playerInfo.getPlayerName().equals(killer.getPlayerName())) {
                    playerInfo.setLastKillTime(Instant.now());
                }
            }
        }
    }

    public void teleportPlayersToSpawn() {
        for (PlayerInfo playerInfo : playerInfos) {
            playerInfo.setPlayerPositionX((float)((Math.random()-0.5)*20) + 27);
            playerInfo.setPlayerPositionY((float)((Math.random()-0.5)*20) + 100);
        }
    }

    //Remove the corpse for all players once it's been found
    public void removeCorpses() {
        for (PlayerInfo playerInfo : playerInfos) {
            if (!playerInfo.isAlive()) {
                playerInfo.setCorpseFound(true);
                logger.info("Corpse of player {} was removed", playerInfo.getPlayerName());
            }
        }
    }

    //Sets all the timer of killers to current time -> for example to stop them from killing again right after voting conducted
    public void updateKilltimers() {
        for (PlayerInfo playerInfo : playerInfos) {
            if (Objects.equals(playerInfo.getPlayerRole(), "killer")) {
                playerInfo.setLastKillTime(Instant.now());
            }
        }
    }

    //Checks if one of the multiple possible win conditions occured and returns the winner based on that condition
    //Returns empty string if there is no winners yet
    //Also resets lobby if game is over.
    public String checkForWinner() {
        int remainingPlayerCount = 0;
        for (PlayerInfo playerInfo : playerInfos) {
            if (!Objects.equals(playerInfo.getPlayerRole(), "killer") && playerInfo.isAlive()) {
                remainingPlayerCount++;
            }
        }

        int remainingKillerCount = 0;
        for (PlayerInfo playerInfo : playerInfos) {
            if (Objects.equals(playerInfo.getPlayerRole(), "killer") && playerInfo.isAlive()) {
                remainingKillerCount++;
            }
        }

        //The crewmates have successfully identified and voted out all the killers, therefore making them the winner!
        if (remainingKillerCount == 0) {
            return "crewmate";
        }
        //If there are as many players remaining alive, as there are killers times two, the killers win, because in the
        //next round they can just kill enough people to make the game unwinnable for the crewmates (I think).
        if (remainingPlayerCount <= remainingKillerCount) {
            return "killer";
        }
        //TODO: Check if crewmates finished all tasks
        //TODO: Check if sabotaging caused game loss ...?
        return "";
    }

    public List<PlayerInfo> getAllTeamMembers(String team) {
        if (!Objects.equals(team, "")) {
            List<PlayerInfo> members = new ArrayList<>();
            for (PlayerInfo playerInfo : playerInfos) {
                if (Objects.equals(playerInfo.getPlayerRole(), team)) {
                    members.add(playerInfo);
                }
            }
            return members;
        }
        return new ArrayList<>();
    }

    //Resets the current lobby, all player will be alive again, teleported to spawn and assigned new random roles
    public void resetLobby() {
        for (PlayerInfo playerInfo : playerInfos) {
            playerInfo.setToDefault();
        }
        resetEmergencyTimer();
        shufflePlayerRoles();
        teleportPlayersToSpawn();
    }

    private void updateExistingPlayer(PlayerInfo existingPlayer, PlayerInfo updatedPlayer) {
        // Update the player's position
        existingPlayer.setPlayerPositionX(updatedPlayer.getPlayerPositionX());
        existingPlayer.setPlayerPositionY(updatedPlayer.getPlayerPositionY());
        existingPlayer.setAlive(updatedPlayer.isAlive());
        existingPlayer.setLastHeartbeat(updatedPlayer.getLastHeartbeat()); //Update the heartbeat once player info is updated

        logger.debug("ExistingPlayer{}", existingPlayer);
    }

    private synchronized void addPlayerToLobby(PlayerInfo playerInfo) {
        boolean playerExists = false;
        for (PlayerInfo existingPlayer : playerInfos) {
            if (existingPlayer.getPlayerName().equals(playerInfo.getPlayerName())) {
                playerExists = true;
                break;
            }
        }
        if (!playerExists) {
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

    //Uses a restTemplate to send a PostRequest to the votingService in order to reset the emergencyTimer
    private void resetEmergencyTimer() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8081/api/voting/{lobbyCode}/resetEmergencyCooldown" ;
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class, lobbyCode);
        logger.info(response.toString());
    }

    //If a lobby is reset the roles of the players will be newly assigned.
    private void shufflePlayerRoles() {
        Collections.shuffle(playerInfos); //Randomly shuffle the list
        int killersAssigned = 0;
        for (PlayerInfo player : playerInfos) {
            if (killersAssigned < maxKillerCount) {
                player.setPlayerRole("killer");
                killersAssigned++;
            } else {
                player.setPlayerRole("crewmate");
            }
        }
    }
}
