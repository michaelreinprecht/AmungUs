package lobbyService.lobby;

import lobbyService.lobby.models.Lobby;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LobbyService implements Lobby.LobbyEmptyListener {
    private Map<String, Lobby> lobbies = new HashMap<>();

    public void createLobby(String lobbyCode, int maxPlayerCount, int maxKillerCount, boolean isPrivate) {
        if (!isLobbyCodeUsed(lobbyCode)) {
            Lobby lobby = new Lobby();
            lobby.setLobbyCode(lobbyCode);
            lobby.setMaxPlayerCount(maxPlayerCount);
            lobby.setMaxKillerCount(maxKillerCount);
            lobby.setPrivate(isPrivate);
            // Start player heartbeat
            //TODO: move this to heartbeat Service: lobby.startHeartbeatChecking();
            //Set LobbyService as listener for empty Lobby events
            lobby.setEmptyListener(this);
            // Initialize other properties of the lobby as needed
            lobbies.put(lobbyCode, lobby);
        }
    }

    public Lobby getLobby(String lobbyCode) {
        if (lobbies.get(lobbyCode) == null) {
            return null;
        }
        return lobbies.get(lobbyCode);
    }

    public List<Lobby> getLobbies() {
        return new ArrayList<>(lobbies.values());
    }

    @Override
    public void onLobbyEmpty(String lobbyCode) {
        System.out.println("Removing lobby: " + lobbyCode);
        lobbies.remove(lobbyCode);
    }

    public boolean isLobbyCodeUsed(String lobbyCode) {
        return lobbies.containsKey(lobbyCode);
    }

    public void removePlayerFromLobby(String lobbyCode, String playerName) {
        Lobby lobby = lobbies.get(lobbyCode);
        lobby.removePlayer(playerName);
    }
}
