package heartbeatService.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Getter
@Setter
public class HeartbeatLobby {
    private static final Logger logger = LogManager.getLogger(HeartbeatLobby.class);

    public String lobbyCode;
    private HashMap<String, HeartbeatPlayerInfo> heartbeatPlayerInfos;

    @JsonIgnore
    private transient ScheduledExecutorService executor; // Scheduled executor service for heartbeat checking task
    @JsonIgnore
    private transient LobbyEmptyListener emptyListener; // Listener for empty lobby notification

    public HeartbeatLobby(String lobbyCode) {
        this.lobbyCode = lobbyCode;
        this.heartbeatPlayerInfos = new HashMap<>();
        this.executor = Executors.newSingleThreadScheduledExecutor(); // Initialize the executor
    }

    public void updateHeartbeatPlayerInfo(String playerName) {
        if (!heartbeatPlayerInfos.containsKey(playerName)) {
            heartbeatPlayerInfos.put(playerName, new HeartbeatPlayerInfo(playerName));
        } else {
            HeartbeatPlayerInfo heartbeatPlayerInfo = heartbeatPlayerInfos.get(playerName);
            heartbeatPlayerInfo.setLastHeartbeat(Instant.now());
            heartbeatPlayerInfos.replace(playerName, heartbeatPlayerInfo);
        }
    }

    public void startHeartbeatChecking() {
        if (executor.isShutdown()) {
            executor = Executors.newSingleThreadScheduledExecutor(); // Reinitialize the executor if it's shutdown
        }
        executor.scheduleAtFixedRate(this::checkPlayerHeartbeats, 0, 10, TimeUnit.SECONDS); // Run every 10 seconds
    }

    // Method to stop periodic checking of player heartbeats -> called once lobby is removed
    public void stopHeartbeatChecking() {
        executor.shutdown();
    }

    // Method to periodically check player heartbeats and remove inactive players from the lobby
    private void checkPlayerHeartbeats() {
        try {
            Instant now = Instant.now();
            Iterator<HeartbeatPlayerInfo> iterator = heartbeatPlayerInfos.values().iterator();

            while (iterator.hasNext()) {
                HeartbeatPlayerInfo playerInfo = iterator.next();
                Instant lastHeartbeat = playerInfo.getLastHeartbeat();
                logger.debug("Last heartbeat: {}", lastHeartbeat.toString());
                if (lastHeartbeat != null) {
                    long duration = Duration.between(lastHeartbeat, now).getSeconds();
                    logger.info("Heartbeat duration: {}", duration);
                    if (duration > 10) {
                        logger.info("Player {} has lost heartbeat", playerInfo.getPlayerName());
                        removePlayerFromLobbyService(playerInfo.getPlayerName());
                        iterator.remove(); // Safely remove the heartbeatPlayerInfo from the list
                        if (heartbeatPlayerInfos.isEmpty()) {
                            notifyEmptyListener();
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.info("Error checking player heartbeats: {}", e.getMessage());
        }
    }

    private void removePlayerFromLobbyService(String playerName) {
        logger.info("Trying to remove player from lobby: {}", playerName);
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/api/lobby/{lobbyCode}/lostHeartbeat" ;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> requestEntity = new HttpEntity<>(playerName, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class, lobbyCode);
        logger.info(response.toString());
    }

    // Method to notify listener when lobby becomes empty
    private void notifyEmptyListener() {
        if (emptyListener != null) {
            logger.debug("Notifying empty listener");
            stopHeartbeatChecking();
            emptyListener.onLobbyEmpty(lobbyCode);
        }
    }

    // Interface for lobby empty notification
    public interface LobbyEmptyListener {
        void onLobbyEmpty(String lobbyCode);
    }
}
