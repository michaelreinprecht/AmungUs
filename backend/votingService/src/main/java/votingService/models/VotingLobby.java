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

    // Method used to add a new vote, based on the voting requests votingPlayer and votedPlayer
    public void updateVote(VotingRequest votingRequest) {
        String votingPlayerName = votingRequest.getVotingPlayerName();
        String votedPlayerName = votingRequest.getVotedPlayerName();

        VotingPlayerInfo votingPlayerInfo = votingPlayerInfos.get(votingPlayerName);
        VotingPlayerInfo votedPlayerInfo = votingPlayerInfos.get(votedPlayerName);
        if (isVoteValid(votingPlayerInfo, votedPlayerInfo)) {
            String hasVotedFor = votingPlayerInfo.getHasVotedFor();
            if (hasVotedFor.isEmpty()) { //The votingPlayer has not yet voted for anyone -> add a new vote
                addVote(votingPlayerInfo, votedPlayerInfo);
            }
            //The votingPlayer has already voted for this player -> remove the vote again because the voting button was pressed again
            else if (hasVotedFor.equals(votedPlayerName)) {
                removeVote(votingPlayerInfo, votedPlayerInfo);
            }
            //The votingPlayer has already voted for someone, but wants to update his vote to another player
            // -> remove old vote and add new one
            else {
                removeOldVote(hasVotedFor, votingPlayerInfo);
                addVote(votingPlayerInfo, votedPlayerInfo);
            }
        }
    }

    public String getMostVotedPlayer() {
        int maxVoteCount = Integer.MIN_VALUE;
        String mostVotedPlayer = null;
        boolean tie = false;

        for (VotingPlayerInfo playerInfo : votingPlayerInfos.values()) {
            int voteCount = playerInfo.getVoteCount();
            if (voteCount > maxVoteCount) {
                maxVoteCount = voteCount;
                mostVotedPlayer = playerInfo.getPlayerName();
                tie = false; // Reset tie flag since a new highest vote count is found
            } else if (voteCount == maxVoteCount) {
                // Found another player with the same highest vote count
                tie = true;
            }
        }

        return tie ? null : mostVotedPlayer;
    }

    public VotingPlayerInfo getPlayerInfoForName(String name) {
        return votingPlayerInfos.get(name);
    }

    // Method used to add a new vote, based on the voting requests votingPlayer and votedPlayer
    private void addVote(VotingPlayerInfo votingPlayerInfo, VotingPlayerInfo votedPlayerInfo) {
        String votingPlayerName = votingPlayerInfo.getPlayerName();
        String votedPlayerName = votedPlayerInfo.getPlayerName();

        //Add new vote for votedPlayer
        votedPlayerInfo.incrementVoteCount();
        votedPlayerInfo.addVote(votingPlayerName);
        //Update hasVotedFor for votingPlayer
        votingPlayerInfo.setHasVotedFor(votedPlayerName);
    }

    // Method used to add a new vote, based on the voting requests votingPlayer and votedPlayer
    private void removeVote(VotingPlayerInfo votingPlayerInfo, VotingPlayerInfo votedPlayerInfo) {
        String votingPlayerName = votingPlayerInfo.getPlayerName();

        //Remove vote for votedPlayer
        votedPlayerInfo.decrementVoteCount();
        votedPlayerInfo.removeVote(votingPlayerName);
        //Reset hasVotedFor for votingPlayer -> set value to empty string
        votingPlayerInfo.setHasVotedFor("");
    }

    private void removeOldVote(String hasVotedFor, VotingPlayerInfo votingPlayerInfo) {
        VotingPlayerInfo oldVotePlayerInfo = votingPlayerInfos.get(hasVotedFor);
        String votingPlayerName = votingPlayerInfo.getPlayerName();

        oldVotePlayerInfo.decrementVoteCount();
        oldVotePlayerInfo.removeVote(votingPlayerName);
    }



    private boolean isVoteValid(VotingPlayerInfo votingPlayerInfo, VotingPlayerInfo votedPlayerInfo) {
        if (votingPlayerInfo == null) {
            logger.debug("Voting Player not found in the voting lobby.");
        } else {
            if (!votingPlayerInfo.isAlive()) {
                logger.debug("Dead Player attempted to vote.");
            } else {
                if (votedPlayerInfo == null) {
                    logger.debug("Voted Player not found in the voting lobby.");
                } else {
                    return true;
                }
            }
        }
        return false;
    }
}
