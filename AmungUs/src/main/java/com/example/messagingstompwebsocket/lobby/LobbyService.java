package com.example.messagingstompwebsocket.lobby;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LobbyService {
    private Map<String, Lobby> lobbies = new HashMap<>();

    public void createLobby(String lobbyCode) {
        if (!lobbies.containsKey(lobbyCode)) {
            Lobby lobby = new Lobby();
            lobby.setLobbyCode(lobbyCode);
            // Initialize other properties of the lobby as needed
            lobbies.put(lobbyCode, lobby);
        }
    }

    public void removeLobby(String lobbyCode) {
        lobbies.remove(lobbyCode);
    }

    public Lobby getLobby(String lobbyCode) {
        if (lobbies.get(lobbyCode) == null) {
            createLobby(lobbyCode);
        }
        return lobbies.get(lobbyCode);
    }
}