package com.example.messagingstompwebsocket.player.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KillRequest {

    private String killerName;
    private String victimName;

    public KillRequest(String messageSenderName, String messageText) {
        this.killerName = messageSenderName;
        this.victimName = messageText;
    }

    public KillRequest() {}
}