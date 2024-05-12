package chatService.controllers;

import lobbyService.lobby.models.Lobby;
import lobbyService.player.models.PlayerInfo;
import chatService.models.ChatMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {
	private static final Logger logger = LogManager.getLogger(ChatController.class);

	@MessageMapping("/{lobbyCode}/chatReceiver")
	@SendTo("/chat/{lobbyCode}/messages")
	public String message(@DestinationVariable String lobbyCode, ChatMessage message) {
		//Just print some debug logs.
        logger.info("Message received from: {}", message.getMessageSenderName());
        logger.info("Message content: {}", message.getMessageText());

		String url = "http://localhost:8080/api/lobby/" + lobbyCode;

		RestTemplate restTemplate = new RestTemplate();
		Lobby lobby = restTemplate.getForObject(url, Lobby.class);

		if (lobby != null) {
			PlayerInfo messageSender = lobby.getPlayerInfoForName(message.getMessageSenderName());
			if (messageSender != null && messageSender.isAlive()) {
				//Return a formatted chat message string
				return HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText());
			}
		}
		return null;
	}
}
