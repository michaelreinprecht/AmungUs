package sabotageService.controller;

import org.apache.coyote.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import sabotageService.SabotageServiceApplication;
import sabotageService.services.SabotageService;

@Controller
public class SabotageController {

    private static final Logger logger = LogManager.getLogger(SabotageController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SabotageService sabotageService;

    @MessageMapping("/initiateSabotage/{lobbyCode}")
    @SendTo("/sabotage/sabotageInitiated/{lobbyCode}")
    public boolean sabotage(@PathVariable String lobbyCode, @RequestBody boolean sabotaged) {
        logger.info("Sabotage for lobby {} received successfully", lobbyCode);
        return sabotaged;
    }

    @MessageMapping("/sabotageSuccess/{lobbyCode}")
    public void sabotageSuccess(@PathVariable String lobbyCode) {
        sabotageService.sabotage(lobbyCode);
        if (sabotageService.isSabotageAllowed(lobbyCode)) {
            logger.info("SabotageSuccess for lobby {} received successfully", lobbyCode);
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:8080/api/lobby/{lobbyCode}/SabotageDone";
            ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class, lobbyCode);
            logger.info("SabotageSuccess " + response);
        }
    }

    @PostMapping("/resetSabotage/{lobbyCode}")
    @ResponseBody
    public ResponseEntity<String> resetSabotage(@PathVariable String lobbyCode) {
        logger.info("Resetting Sabotage for lobby: {}", lobbyCode);
        sabotageService.resetSabotage(lobbyCode);
        messagingTemplate.convertAndSend("/sabotage/sabotageCooldown/" + lobbyCode, resetSabotageCooldown(lobbyCode));
        return ResponseEntity.ok("OK");
    }


    @SendTo("/sabotage/sabotageCooldown/{lobbyCode}")
    public ResponseEntity<String> resetSabotageCooldown(@PathVariable String lobbyCode) {
        logger.info("Resetting SabotageCooldown for lobby: {}", lobbyCode);
        return ResponseEntity.ok("OK");
    }

}
