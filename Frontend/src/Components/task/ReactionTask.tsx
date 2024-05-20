import { Task } from '@/app/types';
import React, { useState, useEffect } from 'react';

interface ReactionTaskProps {
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  setCurrentPlayerTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTask: Task;
}

function ReactionTask({ setCurrentTask, setCurrentPlayerTasks, currentTask }: ReactionTaskProps) {
  const [showIcon, setShowIcon] = useState(false);
  const [clickCount, setClickCount] = useState(() => {
    const savedCount = sessionStorage.getItem(`reactionTaskClickCount-${currentTask.id}`);
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [iconPosition, setIconPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showIcon) {
      // Show the icon after a random delay (between 1 second to 3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000;
      timer = setTimeout(() => {
        setShowIcon(true);
        // Generate random position for the icon
        const top = Math.random() * 250; // Adjust the range to fit inside the dedicated box
        const left = Math.random() * 250; // Adjust the range to fit inside the dedicated box
        setIconPosition({ top, left });
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [showIcon]);

  const handleClick = () => {
    if (showIcon) {
      const updatedCount = clickCount + 1;
      setClickCount(updatedCount);
      sessionStorage.setItem(`reactionTaskClickCount-${currentTask.id}`, updatedCount.toString());
      setShowIcon(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showIcon) {
      // Hide the icon after one second
      timer = setTimeout(() => {
        setShowIcon(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showIcon]);

  useEffect(() => {
    if (clickCount >= 7) {
      setCurrentPlayerTasks(prev => prev.map((task, i) => i === currentTask.id ? { ...task, completed: true } : task));
      setCurrentTask({id: 0, name: "NoTask", completed: false });
    }
  }, [clickCount, setCurrentTask]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-4/5 h-4/5 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-4">Reaction Time Task</h1>
      <p className="text-white text-center mb-4">
        Try to click the 🎯 icon before it disappears. You need to click it 7 times.
      </p>
      <div className="relative w-72 h-72 bg-blue-200 border-4 border-blue-500 flex justify-center items-center">
        {showIcon && (
          <div
            className="text-4xl cursor-pointer"
            onClick={handleClick}
            style={{ position: 'absolute', top: iconPosition.top, left: iconPosition.left }}
          >
            🎯
          </div>
        )}
      </div>
      <div className="text-white text-center mt-4">
        Click count: {clickCount}
      </div>
      <button onClick={() => setCurrentTask({id: 0, name: "NoTask", completed: false })} className="mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Save & Exit
      </button>
    </div>
  );
}

export default ReactionTask;
