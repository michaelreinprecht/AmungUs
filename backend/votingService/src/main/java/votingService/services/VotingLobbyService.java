package votingService.services;

import lobbyService.lobby.models.Lobby;
import org.springframework.stereotype.Service;
import votingService.models.VotingLobby;

import java.util.HashMap;
import java.util.Map;

@Service
public class VotingLobbyService {
    private Map<String, VotingLobby> lobbies = new HashMap<>();

    public void createLobby(Lobby lobby) {
        if (!isLobbyCodeUsed(lobby.getLobbyCode())) {
            lobbies.put(lobby.getLobbyCode(), new VotingLobby(lobby));
        }
    }

    public void removeLobby(String lobbyCode) {
        lobbies.remove(lobbyCode);
    }

    public VotingLobby getLobby(String lobbyCode) {
        if (lobbies.get(lobbyCode) == null) {
            return null;
        }
        return lobbies.get(lobbyCode);
    }

    public boolean isLobbyCodeUsed(String lobbyCode) {
        return lobbies.containsKey(lobbyCode);
    }
}
