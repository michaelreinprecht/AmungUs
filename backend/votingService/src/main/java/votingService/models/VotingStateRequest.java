package votingService.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VotingStateRequest {
    private String senderName;
    private boolean votingState;

    public VotingStateRequest(String senderName, boolean votingState) {
        this.senderName = senderName;
        this.votingState = votingState;
    }

    public VotingStateRequest() {}
}
