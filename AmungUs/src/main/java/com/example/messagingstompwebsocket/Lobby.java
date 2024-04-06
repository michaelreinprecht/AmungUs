package com.example.messagingstompwebsocket;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Lobby {
    private String lobbyCode;
    private PlayerPositions playerPositions;
}
