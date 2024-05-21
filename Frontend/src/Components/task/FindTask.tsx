import { Task } from '@/app/types';
import React, { useState, useEffect } from 'react';

const iconOptions = ['💀', '☠️', '👻', '👁️', '🌪️', '🤖']; // New icon options

type Icon = '💀' | '☠️' | '👻' | '👁️' | '🌪️' | '🤖';

interface FindTaskProps {
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  setCurrentPlayerTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTask: Task;
  updateTask: (updatedTask: Task) => void;
}

function FindTask({ setCurrentTask, setCurrentPlayerTasks, currentTask, updateTask }: FindTaskProps) {
  const totalIcons = 64; // Total number of icons (8x8 grid)
  const gridSize = Math.floor(Math.sqrt(totalIcons)); // Grid size adjusted for a square
  const [icons, setIcons] = useState<Icon[]>(() => {
    const savedIcons = sessionStorage.getItem(`FindTask-${currentTask.id}`);
    return savedIcons ? JSON.parse(savedIcons) : generateIcons();
  });
  const [skullsCount, setSkullsCount] = useState<number>(0);

  useEffect(() => {
    let count = 0;
    icons.forEach(icon => {
      if (icon === '💀') {
        count++;
      }
    });
    setSkullsCount(count);
    if (count === 0) {
      setCurrentPlayerTasks(prev => prev.map((task, i) => i === currentTask.id ? { ...task, completed: true } : task));
      updateTask(currentTask);
      setCurrentTask({id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: ""});
    }
    sessionStorage.setItem(`FindTask-${currentTask.id}`, JSON.stringify(icons));
  }, [icons, setCurrentTask]);

  function generateIcons(): Icon[] {
    const newIcons: Icon[] = [];
    for (let i = 0; i < totalIcons; i++) {
      let randomIcon: Icon = iconOptions[Math.floor(Math.random() * iconOptions.length)] as Icon;
      newIcons.push(randomIcon);
    }
    return newIcons;
  }

  function handleBombClick(iconId: number) {
    const clickedIcon = icons[iconId];
    if (clickedIcon === '💀') {
      setIcons(prevIcons => {
        const newIcons = [...prevIcons];
        newIcons[iconId] = null!;
        return newIcons;
      });
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-4">Find Icons Task</h1>
      <p className="text-white text-center mb-4">
        Find and click on the 💀!
      </p>
      <div className="grid grid-cols-8 gap-2">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="text-4xl cursor-pointer"
            onClick={() => handleBombClick(index)}
          >
            {icon}
          </div>
        ))}
      </div>
      <div className="text-white text-center mt-4">
        💀 left: {skullsCount}
      </div>
      <button onClick={() => setCurrentTask({id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: ""})} className="mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Save & Exit
      </button>
    </div>
  );
}

export default FindTask;
