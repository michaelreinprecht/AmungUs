package com.example.messagingstompwebsocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class ChatController {
	@MessageMapping("/chatReceiver")
	@SendTo("/chat/messages")
	public ChatMessages message(ChatMessage message) throws Exception {
		return new ChatMessages(HtmlUtils.htmlEscape(message.getMessageSenderName() + ": " + message.getMessageText()));
	}
}
