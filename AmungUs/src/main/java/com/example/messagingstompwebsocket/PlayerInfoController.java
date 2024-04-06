package com.example.messagingstompwebsocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerInfoController {

    @Autowired
    private LobbyService lobbyService;

    @MessageMapping("/{lobbyCode}/playerPositionReceiver")
    @SendTo("/chat/{lobbyCode}/positions")
    public PlayerPositions playerPositions(@DestinationVariable String lobbyCode, PlayerPosition playerPosition) throws Exception {
        System.out.println("PlayerInfo received for lobby code: " + lobbyCode);
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            // Update the player position in the lobby or add it if it's a new player
            lobby.updatePlayerPosition(playerPosition);

            // Send the updated player positions to all players
            return new PlayerPositions(lobby.getPlayerPositions().getPlayerPositions());
        } else {
            // Should only be called if backend cannot find the lobbyCode and fails to create a new lobby
            return null;
        }
    }
}
