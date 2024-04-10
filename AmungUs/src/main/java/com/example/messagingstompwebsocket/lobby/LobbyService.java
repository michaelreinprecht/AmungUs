package com.example.messagingstompwebsocket.lobby;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LobbyService {
    private Map<String, Lobby> lobbies = new HashMap<>();

    public void createLobby(String lobbyCode, int maxPlayerCount, boolean isPrivate) {
        if (!lobbies.containsKey(lobbyCode)) {
            Lobby lobby = new Lobby();
            lobby.setLobbyCode(lobbyCode);
            lobby.setMaxPlayerCount(maxPlayerCount);
            lobby.setPrivate(isPrivate);
            // Initialize other properties of the lobby as needed
            lobbies.put(lobbyCode, lobby);
        }
    }

    //TODO: use this method once all players have left a lobby!
    public void removeLobby(String lobbyCode) {
        lobbies.remove(lobbyCode);
    }

    public Lobby getLobby(String lobbyCode) {
        if (lobbies.get(lobbyCode) == null) {
            createLobby(lobbyCode, 10, false); //TODO: only call when creating lobby in create lobby page
            return lobbies.get(lobbyCode);
        }
        return lobbies.get(lobbyCode);
    }

    public List<Lobby> getLobbies() {
        return new ArrayList<>(lobbies.values());
    }
}
