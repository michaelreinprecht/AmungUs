package votingService.controllers;

import lobbyService.lobby.models.Lobby;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import votingService.models.VotingLobby;
import votingService.models.VotingPlayerInfo;
import votingService.models.VotingRequest;
import votingService.services.VotingLobbyService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
    public boolean votingState(@DestinationVariable String lobbyCode, boolean votingState) throws Exception {
        // Get the lobby from the lobby service
        logger.debug("Getting voting state for lobby: {}", lobbyCode);
        if (votingState) {
            // Get lobby from lobbyService and add it in here
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8080/api/lobby/" + lobbyCode;
            Lobby lobby = restTemplate.getForObject(url, Lobby.class);

            if (lobby != null) {
                logger.info("Starting voting for lobby: {}", lobby.getLobbyCode());
                votingLobbyService.createLobby(lobby);
                //messagingTemplate.convertAndSend("/voting/" + lobbyCode + "/votingState", true);
            } else {
                logger.debug("Attempted to create a voting for a non existing lobby.");
            }
        } else {
            votingLobbyService.removeLobby(lobbyCode);
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

    private void isAddingNewVote(VotingRequest votingRequest, VotingLobby lobby) {
    }
}
