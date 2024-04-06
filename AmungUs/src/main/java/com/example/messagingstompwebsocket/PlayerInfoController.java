package com.example.messagingstompwebsocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;

@Controller
public class PlayerInfoController {

    @Autowired
    private LobbyService lobbyService;

    private List<PlayerPosition> playerPositions = new ArrayList<>();

    @MessageMapping("/{lobbyCode}/playerPositionReceiver")
    @SendTo("/chat/{lobbyCode}/positions")
    public PlayerPositions playerPositions(@DestinationVariable String lobbyCode, PlayerPosition playerPosition) throws Exception {
        /*
        // Update the player position in the list or add it if it's a new player
        System.out.println(playerPosition.getPlayerName() + " " + playerPosition.getPlayerPositionX() + " "+ playerPosition.getPlayerPositionX() + " ");
        boolean playerExists = false;
        for (PlayerPosition existingPlayer : playerPositions) {
            if (existingPlayer.getPlayerName().equals(playerPosition.getPlayerName())) {
                existingPlayer.setPlayerPositionX(playerPosition.getPlayerPositionX());
                existingPlayer.setPlayerPositionY(playerPosition.getPlayerPositionY());
                playerExists = true;
                break;
            }
        }
        if (!playerExists) {
            playerPositions.add(playerPosition);
        }

        // Send the updated player positions to all players
        return new PlayerPositions(playerPositions);
         */


        System.out.println("PlayerInfo received for lobby code: " + lobbyCode);
        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            // Update the player position in the lobby or add it if it's a new player
            lobby.updatePlayerPosition(playerPosition);
            playerPositions = lobby.getPlayerPositions().getPlayerPositions();
            return new PlayerPositions(playerPositions);
        } else {
            // Handle case where lobby with provided code doesn't exist
            return null;
        }
    }
}
