package heartbeatService.controllers;

import heartbeatService.models.HeartbeatLobby;
import heartbeatService.services.HeartbeatLobbyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class HeartbeatController {
	private static final Logger logger = LogManager.getLogger(HeartbeatController.class);

	@Autowired
	HeartbeatLobbyService heartbeatLobbyService;

	@MessageMapping("/{lobbyCode}/heartbeatReceiver")
	@SendTo("/lobby/{lobbyCode}/heartbeat")
	public boolean heartbeats(@DestinationVariable String lobbyCode, String playerName) throws Exception {
		logger.info("Received heartbeat request for lobby code: {}", lobbyCode);
		// Get the lobby from the lobby service

		if (!heartbeatLobbyService.isLobbyCodeUsed(lobbyCode)) {
			logger.info("Created new heartbeatLobby!");
			heartbeatLobbyService.createLobby(new HeartbeatLobby(lobbyCode), playerName);
		} else {
			logger.info("Heartbeat received for player: {}", playerName + " in lobby: " + lobbyCode);
			heartbeatLobbyService.updateLobby(lobbyCode, playerName);
		}

		return false;
	}
}
