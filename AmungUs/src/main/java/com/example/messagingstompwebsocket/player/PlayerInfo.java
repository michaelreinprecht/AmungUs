package com.example.messagingstompwebsocket.player;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PlayerInfo {
    private String playerName;
    private float playerPositionX;
    private float playerPositionY;
    private boolean alive;

}
