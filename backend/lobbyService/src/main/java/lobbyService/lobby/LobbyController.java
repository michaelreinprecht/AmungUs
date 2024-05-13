package lobbyService.lobby;

import lobbyService.lobby.models.Lobby;
import lobbyService.player.models.PlayerInfo;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@Controller
public class LobbyController {
    @Autowired
    private LobbyService lobbyService;

    private static final Logger logger = LogManager.getLogger(LobbyController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public LobbyController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    //Returns all public lobbies that are not currently full
    @GetMapping("/api/lobby/getPublicLobbies")
    @ResponseBody
    public List<Lobby> getLobbies() {
        List<Lobby> nonFullLobbies = new ArrayList<>();
        for (Lobby lobby : lobbyService.getLobbies()) {
            if (lobby.getPlayerCount() < lobby.getMaxPlayerCount() && !lobby.isPrivate()) {
                nonFullLobbies.add(lobby);
            }
        }

        return nonFullLobbies;
    }

    @GetMapping("/api/lobby/{lobbyCode}")
    @ResponseBody
    public Lobby getLobby(@PathVariable String lobbyCode) {
        return lobbyService.getLobby(lobbyCode);
    }

    @PostMapping("/api/lobby/createLobby")
    @ResponseBody
    public ResponseEntity<Map<String, String>> createLobby(@RequestBody Map<String, Object> requestBody) {
        Integer maxPlayerCount = (Integer) requestBody.get("maxPlayerCount");
        Integer maxKillerCount = (Integer) requestBody.get("maxKillerCount");
        boolean isPrivate = (boolean) requestBody.get("isPrivate");

        // Generate a random lobby code
        String lobbyCode = generateRandomCode();
        // Make sure the code is unique
        while (lobbyService.isLobbyCodeUsed(lobbyCode)) {
            lobbyCode = generateRandomCode();
        }

        lobbyService.createLobby(lobbyCode, maxPlayerCount, maxKillerCount, isPrivate);

        // Return the generated lobby code as a JSON object
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("lobbyCode", lobbyCode);
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/api/lobby/{lobbyCode}/lostHeartbeat")
    @ResponseBody
    public ResponseEntity<String> lostHeartbeat(@PathVariable String lobbyCode, @RequestBody String playerName) {
        logger.info("Removing player due to lost heartbeat.");
        if (lobbyService.isLobbyCodeUsed(lobbyCode)) {
            Lobby lobby = lobbyService.getLobby(lobbyCode);
            lobby.removePlayer(playerName);
            List<PlayerInfo> updatedPlayerPositions = lobby.getPlayerInfos();

            messagingTemplate.convertAndSend("/lobby/" + lobbyCode + "/playerInfo", updatedPlayerPositions);
        }


        // Return empty ok response
        return ResponseEntity.ok("OK");
    }



    private String generateRandomCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int codeLength = 4;
        Random random = new Random();
        StringBuilder sb = new StringBuilder(codeLength);
        for (int i = 0; i < codeLength; i++) {
            int randomIndex = random.nextInt(characters.length());
            sb.append(characters.charAt(randomIndex));
        }
        return sb.toString();
    }
}
