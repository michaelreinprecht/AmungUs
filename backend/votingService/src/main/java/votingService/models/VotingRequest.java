package votingService.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VotingRequest {

    private String votingPlayerName;
    private String votedPlayerName;

    public VotingRequest(String votingPlayerName, String votedPlayerName) {
        this.votingPlayerName = votingPlayerName;
        this.votedPlayerName = votedPlayerName;
    }

    public VotingRequest() {}
}
