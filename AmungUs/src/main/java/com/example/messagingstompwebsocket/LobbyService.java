package com.example.messagingstompwebsocket;

import com.example.messagingstompwebsocket.Lobby;
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
            lobby.setPlayerPositions(new PlayerPositions());
            lobby.setChatMessages(new ChatMessages());
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

    // Other methods for managing lobbies such as adding players, sending messages, etc.

}
