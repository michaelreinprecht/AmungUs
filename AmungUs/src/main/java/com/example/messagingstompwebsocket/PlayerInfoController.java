package com.example.messagingstompwebsocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;

@Controller
public class PlayerInfoController {

    private List<PlayerPosition> playerPositions = new ArrayList<>();

    @MessageMapping("/playerPositionReceiver")
    @SendTo("/playerInfo/positions")
    public PlayerPositions playerPositions(PlayerPosition playerPosition) throws Exception {
        // Update the player position in the list or add it if it's a new player
        boolean playerExists = false;
        for (PlayerPosition existingPlayer : playerPositions) {
            if (existingPlayer.getPlayerName().equals(playerPosition.getPlayerName())) {
                existingPlayer.setPlayerPosition(playerPosition.getPlayerPosition());
                playerExists = true;
                break;
            }
        }
        if (!playerExists) {
            playerPositions.add(playerPosition);
        }

        // Send the updated player positions to all players
        return new PlayerPositions(playerPositions);
    }
}
