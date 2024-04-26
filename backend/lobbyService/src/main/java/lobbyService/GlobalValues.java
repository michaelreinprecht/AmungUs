package lobbyService;

public class GlobalValues {
    // Singleton instance
    private static GlobalValues instance = null;

    // Default values
    private final float killRange = 20;

    // Private constructor to prevent instantiation
    private GlobalValues() {}

    // Method to get the singleton instance
    public static GlobalValues getInstance() {
        if (instance == null) {
            instance = new GlobalValues();
        }
        return instance;
    }

    // Getter and setter for killRange
    public float getKillRange() {
        return killRange;
    }
}
