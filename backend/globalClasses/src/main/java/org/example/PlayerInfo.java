package org.example;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@Getter
@Setter
@ToString
public class PlayerInfo {
    private String playerName;
    private String playerCharacter;
    private float playerPositionX;
    private float playerPositionY;
    private float killedPlayerPositionX;
    private float killedPlayerPositionY;
    private Instant lastKillTime;
    private boolean corpseFound;
    private boolean alive;
    @JsonProperty("isHost")
    private boolean isHost;
    private String playerRole;

    @JsonIgnore
    private Instant lastHeartbeat;
    @JsonIgnore
    private Instant joinedLobbyAt;

    public void setToDefault() {
        alive = true;
        corpseFound = false;
        lastKillTime = null;
    }
}
