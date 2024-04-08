package com.example.messagingstompwebsocket.player;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerPosition {
    private String playerName;
    private float playerPositionX;
    private float playerPositionY;

    @Override
    public String toString() {
        return "PlayerPosition{" +
                "playerName='" + playerName + '\'' +
                ", playerPositionX=" + playerPositionX +
                ", playerPositionY=" + playerPositionY +
                '}';
    }
}
