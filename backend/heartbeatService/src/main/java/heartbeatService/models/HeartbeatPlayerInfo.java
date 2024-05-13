package heartbeatService.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Instant;

@Getter
@Setter
@ToString
public class HeartbeatPlayerInfo {
    private static final Logger logger = LogManager.getLogger(HeartbeatPlayerInfo.class);

    private String playerName;
    private Instant lastHeartbeat;

    public HeartbeatPlayerInfo(String playerName) {
        this.playerName = playerName;
        this.lastHeartbeat = Instant.now();
    }
}
