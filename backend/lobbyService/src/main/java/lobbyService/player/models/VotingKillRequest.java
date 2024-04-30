package lobbyService.player.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VotingKillRequest {


    private String victimName;

    public VotingKillRequest(String victimName) {
        this.victimName = victimName;
    }

    public VotingKillRequest() {}
}