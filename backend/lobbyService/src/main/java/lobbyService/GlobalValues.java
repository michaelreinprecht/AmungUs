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
    private float killCooldown;

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
        killCooldown = 20;
        initializeCollideables();
    }

    private void initializeCollideables() {
        collideables = new ArrayList<>();
        collideables.add(new RectangleCollider(26, 72, 20, 24)); // ButtonCollider
        collideables.add(new RectangleCollider(76, -1, 97, 59));
        collideables.add(new RectangleCollider(-24, -1, 65, 59)); // ButtonRoom
        collideables.add(new RectangleCollider(104, 42, 42, 59));
        collideables.add(new RectangleCollider(104, 130, 42, 59));
        collideables.add(new RectangleCollider(-76, 60, 82, 15));
        collideables.add(new RectangleCollider(-80, 24, 17, 58));
        collideables.add(new RectangleCollider(-76, 114, 81, 46));
        collideables.add(new RectangleCollider(23, 130, 130, 12)); // Room to the left
        collideables.add(new RectangleCollider(-154, 127, 90, 25));
        collideables.add(new RectangleCollider(-216, 84, 40, 100));
        collideables.add(new RectangleCollider(-204, 33, 72, 45));
        collideables.add(new RectangleCollider(-115, 33, 65, 47));
        collideables.add(new RectangleCollider(-178, 8, 20, 25)); // Room to bottom left
        collideables.add(new RectangleCollider(-238, -17, 20, 60));
        collideables.add(new RectangleCollider(-203, -61, 70, 43));
        collideables.add(new RectangleCollider(-178, -35, 20, 20));
        collideables.add(new RectangleCollider(-215, -107, 38, 60)); // Room to bottom
        collideables.add(new RectangleCollider(-163, -134, 70, 20));
        collideables.add(new RectangleCollider(-102, -90, 60, 100));
        collideables.add(new RectangleCollider(-138, -54, 20, 58));
        collideables.add(new RectangleCollider(-138, 6, 20, 20)); // Room to top right
        collideables.add(new RectangleCollider(-80, -35, 16, 20));
        collideables.add(new RectangleCollider(-38, -41, 37, 40)); // Room to bottom right
        collideables.add(new RectangleCollider(-55, -111, 70, 60));
        collideables.add(new RectangleCollider(16, -134, 100, 20));
        collideables.add(new RectangleCollider(88, -103, 72, 100));
        collideables.add(new RectangleCollider(155, 118, 100, 20));//room top right
        collideables.add(new RectangleCollider(214, 100, 20, 90));
        collideables.add(new RectangleCollider(193, 16, 40, 79)); // hallway in the middle
        collideables.add(new RectangleCollider(135, 16, 40, 79));
        collideables.add(new RectangleCollider(224, -29, 40, 79)); // room inbetween the very right rooms
        collideables.add(new RectangleCollider(193, -70, 40, 28)); //hallway bottom right
        collideables.add(new RectangleCollider(135, -70, 40, 28));
        collideables.add(new RectangleCollider(135, -70, 40, 28)); // room bottom right
        collideables.add(new RectangleCollider(116, -90, 40, 65));
        collideables.add(new RectangleCollider(150, -121, 100, 10));
        collideables.add(new RectangleCollider(197, -108, 10, 50));
    }
}
