package lobbyService.player.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class GameOverInfo {
    private String winner;
    private List<PlayerInfo> teamMembers;

    public GameOverInfo(String winner, List<PlayerInfo> teamMembers) {
        this.winner = winner;
        this.teamMembers = teamMembers;
    }
}
