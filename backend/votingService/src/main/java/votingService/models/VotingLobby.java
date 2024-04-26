package votingService.models;

import lobbyService.lobby.models.Lobby;
import lobbyService.player.models.PlayerInfo;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;

@Getter
@Setter
public class VotingLobby {

    private static final Logger logger = LogManager.getLogger(VotingLobby.class);

    private String lobbyCode;
    private HashMap<String, VotingPlayerInfo> votingPlayerInfos;

    public VotingLobby(Lobby lobby) {
        this.lobbyCode = lobby.getLobbyCode();
        this.votingPlayerInfos = new HashMap<>();

        for (PlayerInfo playerInfo: lobby.getPlayerInfos()) {
            VotingPlayerInfo votingPlayerInfo = new VotingPlayerInfo(playerInfo);
            votingPlayerInfos.put(playerInfo.getPlayerName(), votingPlayerInfo);
        }
    }
}
