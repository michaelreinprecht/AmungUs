import { mapHeight, mapWidth } from "@/app/globals";
import { PlayerInfo, Task, TaskObjectData } from "@/app/types";
import React, { useState, useEffect, useRef } from "react";

type MapUIProps = {
  currentPlayerInfo: PlayerInfo | undefined;
  currentPlayerCharacter: string;
  taskObjects: TaskObjectData[];
};

export default function MapUI({
  currentPlayerInfo,
  currentPlayerCharacter,
  taskObjects,
}: MapUIProps) {
  const [isVisible, setIsVisible] = useState(false);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const imageHeight = 1088;
  const imageWidth = 1888;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "M" || event.key === "m") {
        setIsVisible(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "M" || event.key === "m") {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners on component unmount,
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  let playerIconX = "50%";
  let playerIconY = "50%";

  // Calculate scaling factors for width and height
  const widthScaleFactor = windowWidth ? windowWidth / imageWidth : 1;
  const heightScaleFactor = windowHeight ? windowHeight / imageHeight : 1;

  // Choose the smaller scaling factor to ensure the image fits within the container
  const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

  // Calculate the resized dimensions
  const resizedWidth = imageWidth * scaleFactor;
  const resizedHeight = imageHeight * scaleFactor;

  // Calculate icon size based on screen size
  const playerIconSizeFactor = Math.min(windowWidth, windowHeight) / 600; // Just a rough estimate, adjust this factor as needed
  const taskIconSizeFactor = Math.min(windowWidth, windowHeight) / 500; // Just a rough estimate, adjust this factor as needed

  if (currentPlayerInfo) {
    // Scale the player's position based on the resized map dimensions
    const scaledPlayerPositionX =
      ((currentPlayerInfo.playerPositionX + mapWidth / 2) / mapWidth) * 100;
    const scaledPlayerPositionY =
      100 -
      ((currentPlayerInfo.playerPositionY + mapHeight / 2) / mapHeight) * 100;

    // Adjust the player's position based on the container's dimensions
    playerIconX = `${scaledPlayerPositionX}%`;
    playerIconY = `${scaledPlayerPositionY}%`;
  }

  const getScaledTaskPosition = (position: [number, number, number]) => {
    const [x, y] = position;
    const scaledX = ((x + mapWidth / 2) / mapWidth) * 100;
    const scaledY = 100 - ((y + mapHeight / 2) / mapHeight) * 100;
    return { x: `${scaledX}%`, y: `${scaledY}%` };
  };

  return (
    <div>
      {isVisible && (
        <div className="fixed w-4/5 h-4/5 inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 m-auto">
          <div
            className="relative bg-gray-300 opacity-80"
            style={{
              width: `${(resizedWidth / windowWidth) * 100}%`,
              height: `${(resizedHeight / windowHeight) * 100}%`,
            }}
          >
            <img
              src="/AmungusMap.png"
              alt="Map"
              className="absolute inset-0 mx-auto my-auto"
            />
            {currentPlayerInfo && (
              <img
                src={`/${currentPlayerCharacter}-move-1.png`}
                alt="Player"
                className="absolute"
                style={{
                  left: playerIconX,
                  top: playerIconY,
                  transform: "translate(-50%, -50%)",
                  width: `${playerIconSizeFactor}em`,
                  filter: "drop-shadow(0 0 10px lightblue)",
                }}
              />
            )}
            {taskObjects.map((taskObject, index) => {
              const { x, y } = getScaledTaskPosition(taskObject.position);
              return (
                <img
                  key={index}
                  src={taskObject.taskObjectImage}
                  alt="Task"
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    transform: "translate(-50%, -50%)",
                    width: `${taskIconSizeFactor}em`,
                    filter: "drop-shadow(0 0 10px white)",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
