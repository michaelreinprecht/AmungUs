package votingService.controllers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;
import lobbyService.lobby.models.Lobby;

import votingService.models.VotingLobby;
import votingService.services.VotingLobbyService;

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
        logger.info("Voting state change called");
        if (votingState) {
            // Get lobby from lobbyService and add it in here
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8080/api/lobby/" + lobbyCode;
            Lobby lobby = restTemplate.getForObject(url, Lobby.class);

            if (lobby != null) {
                logger.info("Starting voting for lobby: " + lobby.getLobbyCode());
                votingLobbyService.createLobby(lobby);
                //messagingTemplate.convertAndSend("/voting/" + lobbyCode + "/votingState", true);
            } else {
                logger.info("Attempted to create a voting for a non existing lobby.");
            }
        } else {
            votingLobbyService.removeLobby(lobbyCode);
        }


        logger.info("Getting voting state for lobby: " + lobbyCode);
        VotingLobby lobby = votingLobbyService.getLobby(lobbyCode);
        return lobby != null;
    }

    /*
    @MessageMapping("/{lobbyCode}/startVotingReceiver")
    public void startVotingForLobby(@DestinationVariable String lobbyCode) throws Exception {

    }

    @MessageMapping("/{lobbyCode}/stopVotingReceiver")
    public void stopVotingForLobby(@DestinationVariable String lobbyCode) throws Exception {
        // Get lobby from lobbyService and add it in here
        votingLobbyService.removeLobby(lobbyCode);
        messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/votingState");
    }
     */
}
