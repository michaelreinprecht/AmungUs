package com.example.messagingstompwebsocket;

import lombok.Getter;

@Getter
public class Message {

	private String content;

	public Message() {
	}

	public Message(String content) {
		this.content = content;
	}

}
