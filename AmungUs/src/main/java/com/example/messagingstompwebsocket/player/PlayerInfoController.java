package com.example.messagingstompwebsocket.player;

import com.example.messagingstompwebsocket.lobby.Lobby;
import com.example.messagingstompwebsocket.lobby.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.ArrayList;


@Controller
public class PlayerInfoController {

    @Autowired
    private LobbyService lobbyService;

    @MessageMapping("/{lobbyCode}/playerInfoReceiver")
    @SendTo("/lobby/{lobbyCode}/playerInfo")
    public List<PlayerInfo> playerPositions(@DestinationVariable String lobbyCode, PlayerInfo playerInfo) throws Exception {
        //Updating players heartbeat every time he sends a signal,
        //TODO: send this signal not only if player moves but at least every 5 ish seconds!
        playerInfo.setLastHeartbeat(Instant.now());

        System.out.println("PlayerInfo received for lobby code: " + lobbyCode);
        System.out.println("PlayerInfo: " + playerInfo);
        System.out.println();


        // Get the lobby from the lobby service
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            // Update the player position in the lobby or add it if it's a new player
            lobby.updatePlayerInfo(playerInfo);

            // Send the updated player positions to all players
            return lobby.getPlayerInfos();
        } else {
            return null;
        }
    }

    @GetMapping("/api/lobby/{lobbyCode}/playerNames")
    @ResponseBody
    public List<String> getPlayerNames(@PathVariable String lobbyCode) {
        // Handle HTTP GET request for fetching player names
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        if (lobby != null) {
            List<PlayerInfo> playerInfos = lobby.getPlayerInfos();
            List<String> playerNames = new ArrayList<>();
            for (PlayerInfo position : playerInfos) {
                playerNames.add(position.getPlayerName());
            }
            return playerNames;
        } else {
            return null;
        }
    }

    // POST mapping to receive player heartbeats
    @PostMapping("/api/lobby/{lobbyCode}/heartbeat")
    public ResponseEntity<String> receiveHeartbeat(@PathVariable String lobbyCode, @RequestBody String playerName) {
        // Update the last received heartbeat time for the player
        Lobby lobby = lobbyService.getLobby(lobbyCode);
        List<PlayerInfo> playerInfos = lobby.getPlayerInfos();
        for (PlayerInfo info : playerInfos) {
            if (info.getPlayerName().equals(playerName)) {
                info.setLastHeartbeat(Instant.now());
            }
        }
        return ResponseEntity.ok().build();
    }
}
