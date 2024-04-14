package com.example.messagingstompwebsocket.player;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class PlayerInfo {
    private String playerName;
    private float playerPositionX;
    private float playerPositionY;
    @JsonIgnore
    private Instant lastHeartbeat;

    @Override
    public String toString() {
        return "PlayerInfo{" +
                "playerName='" + playerName + '\'' +
                ", playerPositionX=" + playerPositionX +
                ", playerPositionY=" + playerPositionY +
                ", lastHeartbeat=" + lastHeartbeat +
                '}';
    }
}
