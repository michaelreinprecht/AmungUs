package votingService.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.example.PlayerInfo;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
public class VotingPlayerInfo {

    private static final Logger logger = LogManager.getLogger(VotingPlayerInfo.class);

    private String playerName; //How do I get this ...?
    private String playerCharacter;
    private boolean alive;
    private Set<String> votes;
    private int voteCount;
    @JsonIgnore
    private String hasVotedFor;

    public VotingPlayerInfo(PlayerInfo playerInfo) {
        this.playerName = playerInfo.getPlayerName();
        this.playerCharacter = playerInfo.getPlayerCharacter();
        this.alive = playerInfo.isAlive();
        this.votes = new HashSet<>();
        this.voteCount = 0;
        this.hasVotedFor = "";
    }

    public void incrementVoteCount() {
        this.voteCount++;
    }

    public void decrementVoteCount() {
        this.voteCount--;
    }

    public void addVote(String vote) {
        this.votes.add(vote);
    }

    public void removeVote(String vote) {
        this.votes.remove(vote);
    }
}
