package lobbyService.collission.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

//A rectangular collideable object
@Getter
@Setter
public class RectangleCollider implements Collideable {
    @JsonProperty("xPosition")
    private double xPosition;
    @JsonProperty("yPosition")
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