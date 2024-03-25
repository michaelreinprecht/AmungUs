package com.example.messagingstompwebsocket;

public class ChatMessage {

	private String messageSenderName;
	private String messageText;

	public ChatMessage() {
	}

	public ChatMessage(String name) {
		this.messageText = name;
	}

	public String getMessageSenderName() {
		return messageSenderName;
	}

	public String getMessageText() {
		return messageText;
	}
	public void setMessageSenderName(String messageSenderName) {
		this.messageSenderName = messageSenderName;
	}


	public void setMessageText(String messageText) {
		this.messageText = messageText;
	}
}
