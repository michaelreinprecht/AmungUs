import React, { useEffect } from "react";
import { PlayerInfo, Task } from "@/app/types";

type TaskListProps = {
  currentPlayerTasks: Task[];
  allPlayerTasks: Task[];
  allTasksDone: () => void;
  playerPositions: PlayerInfo[];
};

const TaskList: React.FC<TaskListProps> = ({ currentPlayerTasks, allPlayerTasks, allTasksDone, playerPositions }) => {

  const crewmateTaskLength = playerPositions.filter((player) => player.playerRole === "crewmate").length *6;
  const crewmateTasksDone = allPlayerTasks.filter(task => task.completed && playerPositions.find(player => player.playerName === task.playerName)?.playerRole === "crewmate").length;

  useEffect(() => {
    if(crewmateTasksDone === crewmateTaskLength && crewmateTaskLength > 0) allTasksDone()
  },[crewmateTasksDone, crewmateTaskLength])
  
  
  return (
    <div className="task-list top-2 left-2">
      <h3>All Crewmate Tasks</h3>
      <p>
        {(crewmateTasksDone / crewmateTaskLength * 100).toFixed(2)}%
        ({crewmateTasksDone}/{crewmateTaskLength}) Total Crewmate Tasks completed
      </p>
      <br/>
      <h3>Your Tasks</h3>
      <ul>
        {currentPlayerTasks.map((task, index) => (
          <li key={index}>
            {task.name} - {task.completed ? "Completed" : "Incomplete"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

