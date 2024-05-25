import React, { useEffect } from "react";
import { Task } from "@/app/types";

type TaskListProps = {
  currentPlayerTasks: Task[];
  allPlayerTasks: Task[];
};

const TaskList: React.FC<TaskListProps> = ({ currentPlayerTasks, allPlayerTasks }) => {
  const totalTasks = allPlayerTasks.length;
  const completedTasks = allPlayerTasks.filter(task => task.completed).length;
  const progress = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

  return (
    <div className="task-list top-2 left-2">
      <h3>All Tasks</h3>
      <p>
        {progress}% ({completedTasks}/{totalTasks}) Total Tasks completed
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
