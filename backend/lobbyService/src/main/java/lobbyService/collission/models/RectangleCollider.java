package lobbyService.collission.models;


import lombok.Getter;
import lombok.Setter;

//A rectangular collideable object
@Getter
@Setter
public class RectangleCollider implements Collideable {
    private double xPosition;
    private double yPosition;
    private double width;
    private double height;

    public RectangleCollider(double xPosition, double yPosition, double width, double height) {
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
    }

    @Override
    public boolean collidesWithRectangle(double x, double y, double width, double height) {
        return false;
    }
}