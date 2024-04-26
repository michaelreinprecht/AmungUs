package com.example.messagingstompwebsocket.player;

import com.example.messagingstompwebsocket.GlobalValues;
import com.example.messagingstompwebsocket.Utils;
import com.example.messagingstompwebsocket.lobby.models.Lobby;
import com.example.messagingstompwebsocket.lobby.LobbyService;
import com.example.messagingstompwebsocket.player.models.KillRequest;
import com.example.messagingstompwebsocket.player.models.PlayerInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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
        if (lobby != null && !isColliding()) { //<- hier Kollision abfragen
            //Updating players heartbeat every time he sends a signal
            playerInfo.setLastHeartbeat(Instant.now());

            logger.debug("PlayerInfo received for lobby code: {}", lobbyCode);
            logger.info("PlayerInfo: {}", playerInfo);

            // Update the player position in the lobby or add it if it's a new player
            lobby.updatePlayerInfo(playerInfo);
            // Send the updated player positions to all players
            return lobby.getPlayerInfos();
        } else {
            return null;
        }
    }

    private boolean isColliding() {
        // Hier überprüfen, ob die Fläche welcher der Spieler abdeckt (Fläche aus seiner Position, Höhe, Breite
        // berechnen) mit einer der Flächen definiert in den Collildeable Object Kollidiert! Wenn ja dann return
        // false.

        // Zusätzlich könnte man hier noch prüfen, ob die Kollision nur Vertikal oder Horizontal ist und dann
        // die PlayerPosition doch updaten aber halt jeweils nur horizontal/vertikal.
        return true;
    }

    @MessageMapping("/{lobbyCode}/heartbeatReceiver")
    @SendTo("/lobby/{lobbyCode}/heartbeat")
    public boolean heartbeats(@DestinationVariable String lobbyCode, String playerName) throws Exception {
        logger.debug("Received heartbeat request for lobby code: {}", lobbyCode);
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

    @MessageMapping("/{lobbyCode}/corpseFoundReceiver")
    public void corpseFound(@DestinationVariable String lobbyCode, String corpsePlayerName) throws Exception {
        logger.info("Found corpse for lobby code: {}", lobbyCode);
        logger.info("Corps of player: {}", corpsePlayerName);
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        lobby.removeCorpse(corpsePlayerName);
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
}
