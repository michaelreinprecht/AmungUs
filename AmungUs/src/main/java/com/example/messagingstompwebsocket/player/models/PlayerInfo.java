package com.example.messagingstompwebsocket.player.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class PlayerInfo {
    private String playerName;
    private float playerPositionX;
    private float playerPositionY;
    private float killedPlayerPositionX;
    private float killedPlayerPositionY;
    private boolean alive;
    private String playerRole;

    @JsonIgnore
    private Instant lastHeartbeat;

}
