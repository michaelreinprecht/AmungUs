package com.example.messagingstompwebsocket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

	private String messageSenderName;
	private String messageText;

	public ChatMessage() {
	}

	public ChatMessage(String name) {
		this.messageText = name;
	}

}
