package lobbyService.collission.models;

public interface Collideable {
    boolean collidesWithRectangle(double x, double y, double width, double height);
}
