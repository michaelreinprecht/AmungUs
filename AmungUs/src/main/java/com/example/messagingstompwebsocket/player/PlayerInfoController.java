package com.example.messagingstompwebsocket.player;

import com.example.messagingstompwebsocket.lobby.Lobby;
import com.example.messagingstompwebsocket.lobby.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.ArrayList;


@Controller
public class PlayerInfoController {

    @Autowired
    private LobbyService lobbyService;

    @MessageMapping("/{lobbyCode}/playerPositionReceiver")
    @SendTo("/chat/{lobbyCode}/positions")
    public List<PlayerPosition> playerPositions(@DestinationVariable String lobbyCode, PlayerPosition playerPosition) throws Exception {
        System.out.println("PlayerPosition received for lobby code: " + lobbyCode);
        System.out.println("PlayerPosition: " + playerPosition.toString());
        System.out.println();

        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            // Update the player position in the lobby or add it if it's a new player
            lobby.updatePlayerPosition(playerPosition);

            // Send the updated player positions to all players
            return lobby.getPlayerPositions();
        } else {
            // Should only be called if backend cannot find the lobbyCode and fails to create a new lobby
            return null;
        }
    }

    @GetMapping("/api/lobby/{lobbyCode}/playerNames")
    @ResponseBody
    public List<String> getPlayerNames(@PathVariable String lobbyCode) {
        // Handle HTTP GET request for fetching player names
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            List<PlayerPosition> playerPositions = lobby.getPlayerPositions();
            List<String> playerNames = new ArrayList<>();
            for (PlayerPosition position : playerPositions) {
                playerNames.add(position.getPlayerName());
            }
            return playerNames;
        } else {
            // Should only be called if backend cannot find the lobbyCode and fails to create a new lobby
            return null;
        }
    }
}
