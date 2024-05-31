package lobbyService.player;

import lobbyService.GlobalValues;
import lobbyService.Utils;
import lobbyService.collission.models.Collideable;
import lobbyService.collission.models.RectangleCollider;
import lobbyService.lobby.LobbyService;
import org.example.Lobby;
import lobbyService.player.models.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.example.PlayerInfo;
import org.example.VotingKillRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

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
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            logger.info("PlayerInfo received for lobby code: {}", lobbyCode);
            logger.info("PlayerInfo: {}", playerInfo);

            // Update the player position in the lobby or add it if it's a new player
            if (!isColliding(playerInfo)) {
                lobby.updatePlayerInfo(playerInfo);
            }
            // Seawnd the updated player positions to all players
            return lobby.getPlayerInfos();
        } else {
            return null;
        }
    }

    private boolean isColliding(PlayerInfo playerInfo) {
        double playerX = playerInfo.getPlayerPositionX();
        double playerY = playerInfo.getPlayerPositionY();
        double playerHalfWidth = 6 / 2.0; // Half of the player's width
        double playerHalfHeight = 6 / 2.0; // Half of the player's height

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

    @MessageMapping("/{lobbyCode}/killReceiver")
    @SendTo("/lobby/{lobbyCode}/kills")
    public boolean killPlayer(@DestinationVariable String lobbyCode, KillRequest killRequest) throws Exception {
        logger.info("Received kill request for lobby code: {}", lobbyCode);
        logger.info("Kill attempted by: {}", killRequest.getKillerName());
        logger.info("Attempting to kill: {}", killRequest.getVictimName());
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);

        if (lobby.isGameStarted()) { //Unable to kill if game is not yet started.
            PlayerInfo killer = lobby.getPlayerInfoForName(killRequest.getKillerName());
            PlayerInfo victim = lobby.getPlayerInfoForName(killRequest.getVictimName());
            if (isKillAllowed(killer, victim)) {
                lobby.killPlayer(victim, killer);
                List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
                // Send the updated player info to all players
                messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/gameOver", checkForGameOver(lobbyCode));
                messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
                return true;
            }
        }
        return false;
    }

    //Returns a list of strings, the first string will indicate which team one, the other strings are the team members (e.g. all crewmates)
    @SendTo("/lobby/{lobbyCode}/gameOver")
    public GameOverInfo checkForGameOver(@DestinationVariable String lobbyCode) throws Exception {
        Lobby lobby = lobbyService.getLobby(lobbyCode);

        String winner = lobby.checkForWinner();
        List<PlayerInfo> teamMembers = lobby.getAllTeamMembers(winner);
        GameOverInfo gameOverInfo = new GameOverInfo(winner, teamMembers);
        if (!Objects.equals(winner, "")) {
            lobby.resetLobby();
            lobby.setGameStarted(false);
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/gameStarted", sendGameStarted(lobbyCode));
        }

        logger.info("Winners: {}, for lobby: {}", gameOverInfo.toString(), lobbyCode);
        return gameOverInfo;
    }

    @MessageMapping("/{lobbyCode}/gameStartedReceiver")
    public void receiveGameStarted(@DestinationVariable String lobbyCode, PlayerInfo playerInfo) throws Exception {
        logger.debug("Received game started for lobby code: {}", lobbyCode);
        Lobby lobby = lobbyService.getLobby(lobbyCode);

        //If the player calling this endpoint is host -> we will actually start the game
        //And return the fact that the game is started to the new players
        if (playerInfo != null && playerInfo.isHost()) {
            lobby.setGameStarted(true);
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/gameStarted", sendGameStarted(lobbyCode));
        }
        //If the player calling the endpoint is no host (or is null) -> do not start the game
        //But just return the current game state to the subscribers.
        else {
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/gameStarted", sendGameStarted(lobbyCode));
        }
    }

    //Returns a list of strings, the first string will indicate which team one, the other strings are the team members (e.g. all crewmates)
    @SendTo("/lobby/{lobbyCode}/gameStarted")
    public boolean sendGameStarted(@DestinationVariable String lobbyCode) throws Exception {
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        return lobby.isGameStarted();
    }

    //Receiver for VotingService - kills the given player after a voting (doesn't kill anyone if victimName is empty string)
    @PostMapping("/api/lobby/{lobbyCode}/killVotedPlayer")
    @ResponseBody
    public ResponseEntity<String> killVotedPlayer(@PathVariable String lobbyCode, @RequestBody VotingKillRequest killRequest) throws Exception {
        logger.info("Voted out and killing player: {}", killRequest.getVictimName());
        // Get the lobby from the lobby service

        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby.isGameStarted()) {
            String victimName = killRequest.getVictimName();

            if (!victimName.isEmpty()) {
                PlayerInfo victim = lobby.getPlayerInfoForName(killRequest.getVictimName());
                lobby.killPlayer(victim, null);
            }

            lobby.updateKilltimers(); //Stop killers from killing again right after voting!
            List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();
            lobby.removeCorpses();

            // Teleport players to spawn after voting
            lobby.teleportPlayersToSpawn();
            // Remove the corpses
            lobby.removeCorpses();
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/gameOver", checkForGameOver(lobbyCode));
            // Send the updated player info to all players
            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
        }
        // Return empty ok response
        return ResponseEntity.ok("OK");
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

    @GetMapping("/api/lobby/{lobbyCode}/playerCharacters")
    @ResponseBody
    public List<String> getPlayerCharacters(@PathVariable String lobbyCode) {
        // Handle HTTP GET request for fetching player names
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            List<PlayerInfo> playerInfos = lobby.getPlayerInfos();
            List<String> playerCharacters = new ArrayList<>();
            for (PlayerInfo position : playerInfos) {
                playerCharacters.add(position.getPlayerCharacter());
            }
            return playerCharacters;
        } else {
            return null;
        }
    }

    @GetMapping("/api/lobby/{lobbyCode}/gameStarted")
    @ResponseBody
    public boolean getGameStarted(@PathVariable String lobbyCode) {
        // Handle HTTP GET request for fetching player names
        logger.info("Shits been called");
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        return lobby.isGameStarted();
    }

    private boolean isKillAllowed(PlayerInfo killer, PlayerInfo victim) {
        if (Objects.equals(killer.getPlayerRole(), "killer")) { //Check if player is really killer!
            if (!Objects.equals(victim.getPlayerRole(), "killer")) { //Make sure killers cannot kill other killers!
                if (victim.isAlive()) { //Make sure victim is still alive
                    if (killer.isAlive()) { //Make sure killer is still alive
                        if (victimInRange(killer, victim)) { //Make sure the killer is in range for the kill
                            //Make sure kill is not on cooldown for this killer
                            if (killer.getLastKillTime() == null) {
                                return true;
                            } else {
                                return Duration.between(killer.getLastKillTime(), Instant.now()).getSeconds() >= 15;
                            }
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
}
