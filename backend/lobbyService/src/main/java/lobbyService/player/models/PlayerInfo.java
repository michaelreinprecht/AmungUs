package lobbyService.player.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class PlayerInfo {
    private String playerName;
    private float playerPositionX;
    private float playerPositionY;
    private float killedPlayerPositionX;
    private float killedPlayerPositionY;
    private Instant lastKillTime;
    private boolean corpseFound;
    private boolean alive;
    private String playerRole;

    @JsonIgnore
    private Instant lastHeartbeat;

    public void setToDefault() {
        alive = true;
        corpseFound = false;
    }
}
