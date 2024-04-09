package com.example.messagingstompwebsocket.lobby;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.ArrayList;


@Controller
public class LobbyController {
    @Autowired
    private LobbyService lobbyService;

    @GetMapping("/api/lobby/getLobbies")
    @ResponseBody
    public List<Lobby> getLobbies() {
        List<Lobby> nonFullLobbies = new ArrayList<>();
        for (Lobby lobby : lobbyService.getLobbies()) {
            if (lobby.getPlayerCount() < lobby.getMaxPlayerCount()) {
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
}
