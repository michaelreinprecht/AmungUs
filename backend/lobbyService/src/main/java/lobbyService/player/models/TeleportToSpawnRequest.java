package lobbyService.player.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeleportToSpawnRequest {

    private String senderName;

    public TeleportToSpawnRequest(String senderName, String corpsePlayerName) {
        this.senderName = senderName;
    }

    public TeleportToSpawnRequest() {}
}