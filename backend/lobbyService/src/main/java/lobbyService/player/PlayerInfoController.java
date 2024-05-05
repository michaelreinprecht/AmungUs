package lobbyService.player;

import lobbyService.GlobalValues;
import lobbyService.Utils;
import lobbyService.collission.models.Collideable;
import lobbyService.collission.models.RectangleCollider;
import lobbyService.lobby.LobbyService;
import lobbyService.lobby.models.Lobby;
import lobbyService.player.models.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Controller
public class PlayerInfoController {

    private static final Logger logger = LogManager.getLogger(PlayerInfoController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public PlayerInfoController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Autowired
    private LobbyService lobbyService;

    @MessageMapping("/{lobbyCode}/playerInfoReceiver")
    @SendTo("/lobby/{lobbyCode}/playerInfo")
    public List<PlayerInfo> playerPositions(@DestinationVariable String lobbyCode, PlayerInfo playerInfo) throws Exception {
        logger.info("PlayerINfoReceiver called");
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            //Updating players heartbeat every time he sends a signal
            playerInfo.setLastHeartbeat(Instant.now());

            logger.debug("PlayerInfo received for lobby code: {}", lobbyCode);
            logger.info("PlayerInfo: {}", playerInfo);

            // Update the player position in the lobby or add it if it's a new player
            if (!isColliding(playerInfo)) {
                lobby.updatePlayerInfo(playerInfo);
            }
            // Send the updated player positions to all players
            return lobby.getPlayerInfos();
        } else {
            return null;
        }
    }

    @MessageMapping("/{lobbyCode}/heartbeatReceiver")
    @SendTo("/lobby/{lobbyCode}/heartbeat")
    public boolean heartbeats(@DestinationVariable String lobbyCode, String playerName) throws Exception {
        logger.info("Received heartbeat request for lobby code: {}", lobbyCode);
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            //Updating players heartbeat every time he sends a signal,
            for (PlayerInfo playerInfo : lobby.getPlayerInfos()) {
                if (playerInfo.getPlayerName().equals(playerName)) {
                    playerInfo.setLastHeartbeat(Instant.now());
                    logger.debug("Heartbeat received for player: {}", playerName + " in lobby: " + lobbyCode);

                    // Update the player position in the lobby or add it if it's a new player
                    lobby.updatePlayerInfo(playerInfo);
                    return true;
                }
            }
        }
        return false;
    }

    @MessageMapping("/{lobbyCode}/killReceiver")
    @SendTo("/lobby/{lobbyCode}/kills")
    public boolean killPlayer(@DestinationVariable String lobbyCode, KillRequest killRequest) throws Exception {
        logger.info("Received kill request for lobby code: {}", lobbyCode);
        logger.info("Kill attempted by: {}", killRequest.getKillerName());
        logger.info("Attempting to kill: {}", killRequest.getVictimName());
        // Get the lobby from the lobby service

        Lobby lobby = lobbyService.getLobby(lobbyCode);
        PlayerInfo killer = lobby.getPlayerInfoForName(killRequest.getKillerName());
        PlayerInfo victim = lobby.getPlayerInfoForName(killRequest.getVictimName());
        if (isKillAllowed(killer, victim)) {
            lobby.killPlayer(victim);
            List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
            // Send the updated player info to all players
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
            return true;
        }
        return false;
    }

    @PostMapping("/api/lobby/{lobbyCode}/killVotedPlayer")
    public void killVotedPlayer(@PathVariable String lobbyCode, @RequestBody VotingKillRequest killRequest) throws Exception {
        logger.info("Voted out and killing player: {}", killRequest.getVictimName());
        // Get the lobby from the lobby service

        Lobby lobby = lobbyService.getLobby(lobbyCode);
        PlayerInfo victim = lobby.getPlayerInfoForName(killRequest.getVictimName());
        lobby.killPlayer(victim);
        List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
        lobby.removeCorpse();

        // Send the updated player info to all players
        messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
        // Remove the corpse
        messagingTemplate.convertAndSend("/app/" + lobbyCode + "/corpseFoundReceiver", victim.getPlayerName());
    }

    @MessageMapping("/{lobbyCode}/teleportPlayersToSpawn")
    public void teleportPlayersToSpawn(@DestinationVariable String lobbyCode, TeleportToSpawnRequest request) throws Exception {
        String senderName = request.getSenderName();

        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            PlayerInfo senderPlayerInfo = lobby.getPlayerInfoForName(senderName);
            if (senderPlayerInfo.isAlive()) {
                lobby.teleportPlayersToSpawn();
                List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
                messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
            }
        }
    }

    @MessageMapping("/{lobbyCode}/corpseFoundReceiver")
    public void corpseFound(@DestinationVariable String lobbyCode, CorpseFoundRequest request) throws Exception {
        String senderName = request.getSenderName();
        String corpsePlayerName = request.getCorpsePlayerName();

        logger.info("Found corpse for lobby code: {}", lobbyCode);
        logger.info("Corps of player: {}", corpsePlayerName);
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            PlayerInfo senderPlayerInfo = lobby.getPlayerInfoForName(senderName);
            if (senderPlayerInfo.isAlive()) {
                lobby.removeCorpse();
            }
        }
        List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
        // Send the updated player info to all players
        messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
    }



    @MessageMapping("/{lobbyCode}/isVotingReceiver")
    @SendTo("/lobby/{lobbyCode}/isVoting")
    public boolean setIsVoting(@DestinationVariable String lobbyCode, boolean isVoting) throws Exception {
        logger.info("IsVoting state changed to: {}, for lobby: {}", isVoting, lobbyCode);

        Lobby lobby = lobbyService.getLobby(lobbyCode);
        lobby.setVoting(isVoting);
        return lobby.isVoting();
    }

    @GetMapping("/api/lobby/{lobbyCode}/playerNames")
    @ResponseBody
    public List<String> getPlayerNames(@PathVariable String lobbyCode) {
        // Handle HTTP GET request for fetching player names
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            List<PlayerInfo> playerInfos = lobby.getPlayerInfos();
            List<String> playerNames = new ArrayList<>();
            for (PlayerInfo position : playerInfos) {
                playerNames.add(position.getPlayerName());
            }
            return playerNames;
        } else {
            return null;
        }
    }

    private boolean isKillAllowed(PlayerInfo killer, PlayerInfo victim) {
        if (Objects.equals(killer.getPlayerRole(), "killer")) { //Check if player is really killer!
            if (!Objects.equals(victim.getPlayerRole(), "killer")) { //Make sure killers cannot kill other killers!
                if (victim.isAlive()) { //Make sure victim is still alive
                    if (killer.isAlive()) { //Make sure killer is still alive
                        if (victimInRange(killer, victim)) { //Make sure the killer is in range for the kill
                            return true;
                        }
                    }
                }
            }
        }
        return false; //Checks above failed -> kill not possible
    }

    private boolean victimInRange(PlayerInfo killer, PlayerInfo victim) {
        float killRange = GlobalValues.getInstance().getKillRange();
        // Calculate the distance between killer and victim
        float distance = Utils.getDistanceBetween(killer.getPlayerPositionX(), killer.getPlayerPositionY(), victim.getPlayerPositionX(), victim.getPlayerPositionY());

        return distance <= killRange;
    }

    private boolean isColliding(PlayerInfo playerInfo) {
        double playerX = playerInfo.getPlayerPositionX();
        double playerY = playerInfo.getPlayerPositionY();
        double playerHalfWidth = 7 / 2.0; // Half of the player's width
        double playerHalfHeight = 7 / 2.0; // Half of the player's height

        List<Collideable> colliders = GlobalValues.getInstance().getCollideables();
        for (Collideable collider : colliders) {
            if (collider instanceof RectangleCollider) {
                RectangleCollider rectangleCollider = (RectangleCollider) collider;
                // Calculate the boundaries of the collider rectangle
                double colliderLeft = rectangleCollider.getXPosition() - (rectangleCollider.getWidth() / 2.0); // Adjusted for center
                double colliderRight = rectangleCollider.getXPosition() + (rectangleCollider.getWidth() / 2.0); // Adjusted for center
                double colliderTop = rectangleCollider.getYPosition() - (rectangleCollider.getHeight() / 2.0); // Adjusted for center
                double colliderBottom = rectangleCollider.getYPosition() + (rectangleCollider.getHeight() / 2.0); // Adjusted for center

                // Check for collision
                if (playerX - playerHalfWidth < colliderRight &&
                        playerX + playerHalfWidth > colliderLeft &&
                        playerY - playerHalfHeight < colliderBottom &&
                        playerY + playerHalfHeight > colliderTop) {
                    // Collision detected
                    return true;
                }
            }
        }
        // No collision detected
        return false;
    }

}
