package com.example.messagingstompwebsocket;

import lombok.Getter;

@Getter
public class ChatMessages {

	private String content;

	public ChatMessages() {
	}

	public ChatMessages(String content) {
		this.content = content;
	}

}
