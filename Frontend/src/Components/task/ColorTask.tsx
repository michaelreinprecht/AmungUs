import { Task } from '@/app/types';
import React, { useEffect, useState } from 'react';

// Define an array of valid colors
type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple';

// The initial colors defined as an array of Color type
const initialColors: Color[] = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];

// Function to get CSS class based on the color
const getColorClass = (color: Color): string => {
  switch (color) {
    case 'red': return 'bg-red-500';
    case 'blue': return 'bg-blue-500';
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    case 'orange': return 'bg-orange-500';
    case 'purple': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
}

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

interface ColorTaskProps {
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  setCurrentPlayerTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTask: Task;
}

function ColorTask({ setCurrentTask, setCurrentPlayerTasks, currentTask }: ColorTaskProps) {
  const taskKeyPrefix = `colorTask-${currentTask.id}`;

  const getInitialState = (key: string) => {
    const savedState = sessionStorage.getItem(key);
    return savedState ? JSON.parse(savedState) : shuffleArray([...initialColors]);
  };

  const [startColors, setStartColors] = useState<Color[]>(() => getInitialState(`${taskKeyPrefix}-startColors`));
  const [endColors, setEndColors] = useState<Color[]>(() => getInitialState(`${taskKeyPrefix}-endColors`));
  const [connections, setConnections] = useState<Record<Color, boolean>>(() => {
    const savedConnections = sessionStorage.getItem(`${taskKeyPrefix}-connections`);
    return savedConnections ? JSON.parse(savedConnections) : initialColors.reduce((acc, color) => {
      acc[color] = false;
      return acc;
    }, {} as Record<Color, boolean>);
  });

  useEffect(() => {
    sessionStorage.setItem(`${taskKeyPrefix}-startColors`, JSON.stringify(startColors));
    sessionStorage.setItem(`${taskKeyPrefix}-endColors`, JSON.stringify(endColors));
    sessionStorage.setItem(`${taskKeyPrefix}-connections`, JSON.stringify(connections));
  }, [startColors, endColors, connections, taskKeyPrefix]);

  const handleDrop = (startColor: Color, endColor: Color) => {
    if (startColor === endColor) {
      setConnections(prev => {
        const newConnections = { ...prev, [startColor]: true };
        return newConnections;
      });
    }
  };

  useEffect(() => {
    if (Object.keys(connections).length === initialColors.length &&
        Object.values(connections).every(val => val)) {
      console.log('Task Completed!');
      setCurrentPlayerTasks(prev => prev.map((task, i) => i === currentTask.id ? { ...task, completed: true } : task));
      setCurrentTask({id: 0, name: "NoTask", completed: false });
    }
  }, [connections, setCurrentTask]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-4">Color Matching Task</h1>
      <p className="text-white text-center mb-4">
        Drag each colored field from the top row to its matching colored field in the bottom row to match them.
      </p>
      <div className="flex justify-center w-full mb-2">
        {startColors.map((color, index) => (
          <div key={'start-' + index}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("color", color)}
            className={`w-32 h-16 rounded-lg flex items-center justify-center font-bold text-white cursor-pointer select-none ${getColorClass(color)}`}
            style={{ opacity: connections[color] ? 0.5 : 1, margin: '0 10px' }}
          >
            {connections[color] ? "✓" : ""}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full mb-2">
        {endColors.map((color, index) => (
          <div key={'end-' + index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const draggedColor = e.dataTransfer.getData("color") as Color;
              handleDrop(draggedColor, color);
            }}
            className={`w-32 h-16 rounded-lg flex items-center justify-center font-bold text-white cursor-pointer select-none ${getColorClass(color)}`}
            style={{ opacity: connections[color] ? 0.5 : 1, margin: '0 10px' }}
          >
            {connections[color] ? "✓" : ""}
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentTask({id: 0, name: "NoTask", completed: false })} className="mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Save & Exit
      </button>
    </div>
  );
}

export default ColorTask;
