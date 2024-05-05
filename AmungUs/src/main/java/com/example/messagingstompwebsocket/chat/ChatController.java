package com.example.messagingstompwebsocket.chat;

import com.example.messagingstompwebsocket.chat.models.ChatMessage;
import com.example.messagingstompwebsocket.lobby.models.Lobby;
import com.example.messagingstompwebsocket.lobby.LobbyService;
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

	@MessageMapping("/{lobbyCode}/chatReceiver")
	@SendTo("/lobby/{lobbyCode}/messages")
	public String message(@DestinationVariable String lobbyCode, ChatMessage message) {
		//Just print some debug logs.
		System.out.println();
		System.out.println("Message received from: " + message.getMessageSenderName());
		System.out.println("Message content: " + message.getMessageText());
		System.out.println();

		//return new ChatMessages(HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText()));
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
