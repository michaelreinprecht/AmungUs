import React from 'react';
import { Task } from '@/app/types';

type TaskListProps = {
  tasks: Task[];
};

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="task-list">
      <h3>Current Tasks</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.name} - {task.completed ? "Completed" : "Incomplete"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
