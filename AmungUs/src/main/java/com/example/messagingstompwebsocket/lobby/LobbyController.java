package com.example.messagingstompwebsocket.lobby;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;


@Controller
public class LobbyController {
    @Autowired
    private LobbyService lobbyService;

    //Returns all public lobbies that are not currently full
    @GetMapping("/api/lobby/getPublicLobbies")
    @ResponseBody
    public List<Lobby> getLobbies() {
        List<Lobby> nonFullLobbies = new ArrayList<>();
        for (Lobby lobby : lobbyService.getLobbies()) {
            if (lobby.getPlayerCount() < lobby.getMaxPlayerCount() && !lobby.isPrivate()) {
                nonFullLobbies.add(lobby);
            }
        }

        return nonFullLobbies;
    }

    @GetMapping("/api/lobby/{lobbyCode}")
    @ResponseBody
    public Lobby getLobby(@PathVariable String lobbyCode) {
        return lobbyService.getLobby(lobbyCode);
    }

    @PostMapping("/api/lobby/createLobby")
    @ResponseBody
    public void createLobby(@RequestBody Map<String, Object> requestBody) {
        String lobbyCode = (String) requestBody.get("lobbyCode");
        Integer maxPlayerCount = (Integer) requestBody.get("maxPlayerCount");
        boolean isPrivate = (boolean) requestBody.get("isPrivate");

        lobbyService.createLobby(lobbyCode, maxPlayerCount, isPrivate);
    }
}
