package lobbyService.player.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CorpseFoundRequest {

    private String senderName;
    private String corpsePlayerName;

    public CorpseFoundRequest(String senderName, String corpsePlayerName) {
        this.senderName = senderName;
        this.corpsePlayerName = corpsePlayerName;
    }

    public CorpseFoundRequest() {}
}