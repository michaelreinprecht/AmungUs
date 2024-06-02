package sabotageService.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import sabotageService.SabotageServiceApplication;

@Controller
public class SabotageController {

    private static final Logger logger = LogManager.getLogger(SabotageController.class);

    @MessageMapping("/initiateSabotage/{lobbyCode}")
    @SendTo("/sabotage/sabotageInitiated/{lobbyCode}")
    public boolean sabotage(@PathVariable String lobbyCode, @RequestBody boolean sabotaged) {
        logger.info("Sabotage for lobby {} received successfully", lobbyCode);
        return sabotaged;
    }
}
