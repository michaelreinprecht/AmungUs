package heartbeatService.controllers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class HeartbeatController {
	private static final Logger logger = LogManager.getLogger(HeartbeatController.class);

	@MessageMapping("/{lobbyCode}/chatReceiver")
	@SendTo("/chat/{lobbyCode}/messages")
	public String message(@DestinationVariable String lobbyCode) {
		return "";
	}
}
