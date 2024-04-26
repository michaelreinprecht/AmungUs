package lobbyService.chat;

import lobbyService.chat.models.ChatMessage;
import lobbyService.lobby.LobbyService;
import lobbyService.lobby.models.Lobby;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {
	@Autowired
	private LobbyService lobbyService;

	private static final Logger logger = LogManager.getLogger(ChatController.class);


	@MessageMapping("/{lobbyCode}/chatReceiver")
	@SendTo("/lobby/{lobbyCode}/messages")
	public String message(@DestinationVariable String lobbyCode, ChatMessage message) {
		//Just print some debug logs.
		logger.info("Message received from: " + message.getMessageSenderName());
		logger.info("Message content: " + message.getMessageText());

		Lobby lobby = lobbyService.getLobby(lobbyCode);

		if (lobby != null) {
			//Return a formatted chat message string
			return HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText());
		} else {
			// Handle case where lobby with provided code doesn't exist
			return null;
		}
	}
}
