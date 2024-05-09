package votingService.controllers;

import lobbyService.lobby.models.Lobby;
import lobbyService.player.models.PlayerInfo;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import lobbyService.player.models.VotingKillRequest;
import votingService.models.VotingLobby;
import votingService.models.VotingPlayerInfo;
import votingService.models.VotingRequest;
import votingService.models.VotingStateRequest;
import votingService.services.VotingLobbyService;

import java.util.ArrayList;
import java.util.List;


@Controller
public class VotingController {
    private static final Logger logger = LogManager.getLogger(VotingController.class);

    @Autowired
    VotingLobbyService votingLobbyService;

    private final SimpMessagingTemplate messagingTemplate;

    public VotingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/{lobbyCode}/votingStateReceiver")
    @SendTo("/voting/{lobbyCode}/votingState")
    public boolean votingState(@DestinationVariable String lobbyCode, VotingStateRequest request) throws Exception {
        // Get the lobby from the lobby service
        String senderName = request.getSenderName();
        boolean votingState = request.isVotingState();

        logger.debug("Getting voting state for lobby: {}", lobbyCode);
        RestTemplate restTemplate = new RestTemplate();
        if (votingState) {
            startVoting(restTemplate, senderName, lobbyCode);
        } else { //End of voting process
            stopVoting(restTemplate, senderName, lobbyCode);
        }

        VotingLobby lobby = votingLobbyService.getLobby(lobbyCode);
        return lobby != null;
    }

    @MessageMapping("/{lobbyCode}/votingInfoReceiver")
    @SendTo("/voting/{lobbyCode}/votingInfo")
    public List<VotingPlayerInfo> votingInfo(@DestinationVariable String lobbyCode, VotingRequest votingRequest) throws Exception {
        // Get the lobby from the lobby service
        logger.info("Receiving new vote for lobby: {}", lobbyCode);
        logger.info("Vote by player: {}", votingRequest.getVotingPlayerName());
        logger.info("Vote for player: {}", votingRequest.getVotedPlayerName());

        VotingLobby lobby = votingLobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            //Handle votes ...
            lobby.updateVote(votingRequest);
            return new ArrayList<>(lobby.getVotingPlayerInfos().values()); //Convert values of hashMap to list and return
        } else {
            logger.debug("Attempted to vote for a non existing lobby.");
            return null;
        }
    }

    @MessageMapping("/{lobbyCode}/votingKillReceiver")
    @SendTo("/voting/{lobbyCode}/votingKill")
    public String votingKill(@DestinationVariable String lobbyCode, String killedPlayer) throws Exception {
        return killedPlayer;
    }

    private void startVoting(RestTemplate restTemplate, String senderName, String lobbyCode) {
        String url = "http://localhost:8080/api/lobby/" + lobbyCode;

        Lobby lobby = restTemplate.getForObject(url, Lobby.class);
        if (lobby != null) {
            PlayerInfo senderPlayerInfo = lobby.getPlayerInfoForName(senderName);
            if (senderPlayerInfo.isAlive()) { //Check if player sending message is alive
                logger.info("Starting voting for lobby: {}", lobby.getLobbyCode());
                votingLobbyService.createLobby(lobby);
            }
        } else {
            logger.debug("Attempted to create a voting for a non existing lobby.");
        }
    }

    private void stopVoting(RestTemplate restTemplate, String senderName, String lobbyCode) {
        VotingLobby lobby = votingLobbyService.getLobby(lobbyCode);
        VotingPlayerInfo senderPlayerInfo = lobby.getPlayerInfoForName(senderName);
        if (senderPlayerInfo.isAlive()) { //Check if player sending message is alive
            String playerToKill = lobby.getMostVotedPlayer();
            String url = "http://localhost:8080/api/lobby/{lobbyCode}/killVotedPlayer";
            if (playerToKill != null) {
                //Send message to lobbyService WebSocket to kill the player
                VotingKillRequest killRequest = new VotingKillRequest(playerToKill);
                logger.info("KillRequest: {}", killRequest.getVictimName());
                try {
                    restTemplate.postForObject(url, killRequest, Void.class, lobbyCode);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
            //Empty string cannot be a name = not killing anyone, just updating kill timers after voting ended
            VotingKillRequest killRequest = new VotingKillRequest("");
            try {
                restTemplate.postForObject(url, killRequest, Void.class, lobbyCode);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            //Remove the lobby from the votingService
            votingLobbyService.removeLobby(lobbyCode);
        }
    }
}
