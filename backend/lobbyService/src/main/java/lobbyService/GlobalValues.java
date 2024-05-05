package lobbyService;

import lobbyService.collission.models.Collideable;
import lobbyService.collission.models.RectangleCollider;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class GlobalValues {
    // Singleton instance
    private static GlobalValues instance = null;

    // Getter and setter for killRange
    // Default values
    @Getter
    private float killRange;

    @Getter
    private List<Collideable> collideables;

    // Private constructor to prevent instantiation
    private GlobalValues() {
        initializeDefaultValues();
    }

    // Method to get the singleton instance
    public static GlobalValues getInstance() {
        if (instance == null) {
            instance = new GlobalValues();
        }
        return instance;
    }

    private void initializeDefaultValues() {
        killRange = 20;

        initializeCollideables();
    }

    private void initializeCollideables() {
        collideables = new ArrayList<>();
        collideables.add(new RectangleCollider(40, 40, 10, 10));
    }
}
