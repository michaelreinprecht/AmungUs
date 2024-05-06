package com.example.messagingstompwebsocket;

//Class for useful methods that will likely be used more than once
public class Utils {
    public static float getDistanceBetween(float xPos1, float yPos1, float xPos2, float yPos2) {
        return (float) Math.sqrt(Math.pow(xPos2 - xPos1, 2) + Math.pow(yPos2 - yPos1, 2));
    }
}
