/*
package com.example.messagingstompwebsocket.config;

import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

public class WebSocketEventListener implements ApplicationListener<SessionDisconnectEvent> {

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        String disconnectReason = headerAccessor.getMessageHeaders().get("simpDisconnectMessage").toString();
        // Handle heartbeat failure or client disconnect
        System.out.println("WebSocket session disconnected: " + sessionId + " Reason: " + disconnectReason);
    }
}*/