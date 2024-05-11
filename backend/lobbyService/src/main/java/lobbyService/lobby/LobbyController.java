package lobbyService.lobby;

import lobbyService.lobby.models.Lobby;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@Controller
public class LobbyController {
    @Autowired
    private LobbyService lobbyService;

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
    public ResponseEntity<Map<String, String>> lostHeartbeat(@PathVariable String lobbyCode, String playerName) {
        if (lobbyService.isLobbyCodeUsed(lobbyCode)) {
            lobbyService.removePlayerFromLobby(lobbyCode, playerName);
        }

        // Return empty ok response
        Map<String, String> responseBody = new HashMap<>();
        return ResponseEntity.ok(responseBody);
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
