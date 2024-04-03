package com.example.messagingstompwebsocket;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PlayerPositions {
    private List<PlayerPosition> playerPositions;

    public PlayerPositions() {}

    public PlayerPositions(List<PlayerPosition> playerPositions) {
        this.playerPositions = playerPositions;
    }
}