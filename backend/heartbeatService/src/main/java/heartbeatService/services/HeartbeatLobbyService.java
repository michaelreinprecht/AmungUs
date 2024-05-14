package heartbeatService.services;

import heartbeatService.models.HeartbeatLobby;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class HeartbeatLobbyService implements HeartbeatLobby.LobbyEmptyListener {
    private Map<String, HeartbeatLobby> lobbies = new HashMap<>();

    public synchronized void createLobby(HeartbeatLobby lobby, String playerName) {
        lobby.updateHeartbeatPlayerInfo(playerName);
        if (!lobbies.containsKey(lobby.lobbyCode)) {
            lobbies.put(lobby.getLobbyCode(), lobby);
            lobby.startHeartbeatChecking(); //Start checking if players send a heartbeat every 10 seconds
        }
    }

    public void updateLobby(String lobbyCode, String playerName) {
        HeartbeatLobby lobby = lobbies.get(lobbyCode);
        lobby.updateHeartbeatPlayerInfo(playerName);
    }

    public boolean isLobbyCodeUsed(String lobbyCode) {
        return lobbies.containsKey(lobbyCode);
    }

    //Removes the lobby if all players have left it (no heartbeats registered in the last 10 seconds)
    @Override
    public void onLobbyEmpty(String lobbyCode) {
        System.out.println("Removing lobby: " + lobbyCode);
        lobbies.remove(lobbyCode);
    }
}
