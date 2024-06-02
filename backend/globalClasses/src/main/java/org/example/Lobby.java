package org.example;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Getter
@Setter
public class Lobby {

    private static final Logger logger = LogManager.getLogger(Lobby.class);

    private String lobbyCode;
    private List<PlayerInfo> playerInfos;
    private boolean isGameStarted;
    private boolean isVoting;
    private int playerCount;
    private int maxPlayerCount;
    private int killerCount;
    private int maxKillerCount;
    private boolean isPrivate;

    @JsonIgnore
    private transient LobbyEmptyListener emptyListener; // Listener for empty lobby notification

    public Lobby() {
        this.playerInfos = new ArrayList<>();
        this.isGameStarted = false;
        this.isPrivate = false;
        this.playerCount = 0;
        this.killerCount = 0;
    }

    public void updatePlayerInfo(PlayerInfo playerInfo) {
        // Check if the player already exists in the lobby
        boolean playerExists = false;
            for (PlayerInfo existingPlayer : playerInfos) {
                if (existingPlayer.getPlayerName().equals(playerInfo.getPlayerName())) {
                    if (isGameStarted) { //Only allow updates if game is started
                        updateExistingPlayer(existingPlayer, playerInfo);
                    }
                    playerExists = true;
                    break;
                }
            }
        // If the player doesn't exist in the lobby and the game is not yet started, add them
        if (!playerExists && !isGameStarted) {
            addPlayerToLobby(playerInfo);
        }
    }



    // Method to notify listener when lobby becomes empty
    private void notifyEmptyListener() {
        if (emptyListener != null) {
            logger.debug("Notifying empty listener");
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
                //If playerInfo that was removed was the host and lobby is still running, assign a new host.
                else if (playerInfo.isHost()) {
                    assignNewHost();
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
    public String checkForWinner(boolean taskWin) {
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
        //Crewmates completed all the tasks, therefore the crewmates win
        if(taskWin) {
            return "crewmate";
        }
        //The crewmates have successfully identified and voted out all the killers, therefore making them the winner!
        else if (remainingKillerCount == 0) {
            return "crewmate";
        }
        //If there are as many players remaining alive, as there are killers times two, the killers win, because in the
        //next round they can just kill enough people to make the game unwinnable for the crewmates (I think).
        else if (remainingPlayerCount <= remainingKillerCount) {
            return "killer";
        }
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
        resetTasks();
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
            //Set timestamp for when player joined the lobby -> used to track who's going to become next host
            playerInfo.setJoinedLobbyAt(Instant.now());
            //Set default values for playerInfo
            playerInfo.setToDefault();
            //Increase player count and add player to playerInfos list
            playerCount++;
            //If this is the first player joining, this player is the host.
            if (playerInfos.isEmpty()) {
                logger.info("Set new host for a lobby.");
                playerInfo.setHost(true);
            }
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
                killerCount=killersAssigned;
            } else {
                player.setPlayerRole("crewmate");
            }
        }
    }

    private void resetTasks(){
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8084/resetTasks/{lobbyCode}" ;
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class, lobbyCode);
        logger.info("Tasks reset: " + response);
    }

    private void assignNewHost() {
        playerInfos.sort(Comparator.comparing(PlayerInfo::getJoinedLobbyAt));
        PlayerInfo newHost = playerInfos.get(0);
        newHost.setHost(true);

        logger.info("New host assigned: {} in lobby: {}", newHost.getPlayerName(), lobbyCode);
    }
}
