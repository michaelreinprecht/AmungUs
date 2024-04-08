package com.example.messagingstompwebsocket;

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
	@SendTo("/chat/{lobbyCode}/messages")
	public ChatMessages message(@DestinationVariable String lobbyCode, ChatMessage message) {
		//Just print some debug logs.
		System.out.println();
		System.out.println("Message received from: " + message.getMessageSenderName());
		System.out.println("Message content: " + message.getMessageText());
		System.out.println();

		//return new ChatMessages(HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText()));
		Lobby lobby = lobbyService.getLobby(lobbyCode);

		if (lobby != null) {
			//lobby.setChatMessages(new ChatMessages(lobby.getChatMessages() + HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText())));
			// Assuming your Lobby entity has a method to get the list of messages
			return new ChatMessages(HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText()));
		} else {
			// Handle case where lobby with provided code doesn't exist
			return null;
		}
	}
}
