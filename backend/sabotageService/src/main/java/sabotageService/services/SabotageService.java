package sabotageService.services;

import lombok.Getter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class SabotageService {

    private static final Logger logger = LogManager.getLogger(SabotageService.class);


    private HashMap <String, Boolean> allowSabotageMap = new HashMap<>();
    private HashMap <String, Boolean> alreadySabotagedMap = new HashMap<>();

    //Method to protect from multiple calls in a row
    public void sabotage(String lobbyCode) {

        if (!alreadySabotagedMap.containsKey(lobbyCode)) {
            alreadySabotagedMap.put(lobbyCode, true);

            logger.info("SabotageService for lobby {} set Sabotage to true", lobbyCode);
            allowSabotageMap.put(lobbyCode, true);
        }
        else{
            allowSabotageMap.remove(lobbyCode);
            allowSabotageMap.put(lobbyCode, false);
        }
    }

    public void resetSabotage(String lobbyCode) {
        alreadySabotagedMap.remove(lobbyCode);
        allowSabotageMap.remove(lobbyCode);
    }


    public boolean isSabotageAllowed(String lobbyCode) {
        return allowSabotageMap.get(lobbyCode);
    }
}
