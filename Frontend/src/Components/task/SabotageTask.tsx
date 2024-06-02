import { serverAddress } from '@/app/globals';
import { Task } from '@/app/types';
import { Client } from '@stomp/stompjs';
import React, { useState } from 'react';

interface SabotageTaskProps {
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  currentTask: Task;
  lobbyCode: string;
}

function SabotageTask({ setCurrentTask, lobbyCode,currentTask }: SabotageTaskProps) {
  const [numbers, setNumbers] = useState<number[]>(() => generateRandomNumbers());
  const [inputValue, setInputValue] = useState<string>('');
  const [order, setOrder] = useState<'ascending' | 'descending'>(() => getRandomOrder());
  const [error, setError] = useState<string>('');

  function generateRandomNumbers(): number[] {
    const randomNumbers = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    return randomNumbers;
  }

  function getRandomOrder(): 'ascending' | 'descending' {
    return Math.random() > 0.5 ? 'ascending' : 'descending';
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const inputNumbers = inputValue.split(',').map(Number);
    const sortedNumbers = order === 'ascending' ? [...numbers].sort((a, b) => a - b) : [...numbers].sort((a, b) => b - a);

    if (inputNumbers.length !== numbers.length) {
      setError(`Please enter exactly ${numbers.length} numbers.`);
      return;
    }

    for (let i = 0; i < inputNumbers.length; i++) {
      if (inputNumbers[i] !== sortedNumbers[i]) {
        setError('Wrong numbers or numbers are not in the correct order.');
        return;
      }
    }
    const sabotageClient = new Client({
        brokerURL: `ws://${serverAddress}:8085/sabotageService`,
        onConnect: () => {
          sabotageClient.publish({
            destination: `/sabotageApp/initiateSabotage/${lobbyCode}`,
            body: JSON.stringify(false),
          });
        },
      });
      sabotageClient.activate();
    setCurrentTask({ id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: "" });
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-4">Sabotage Task</h1>
      <p className="text-white text-center mb-4">
        Arrange the numbers in {order} order. Enter the numbers separated by commas.
      </p>
      <div className="flex justify-center mb-4">
        {numbers.map((num, index) => (
          <div key={index} className="mx-2 text-2xl text-white">
            {num}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="p-2 mb-4 w-3/4 rounded border"
        placeholder="Type in the correct order"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Submit Numbers
      </button>
      <button onClick={() => setCurrentTask({ id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: "" })} className="mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Exit
      </button>
    </div>
  );
}

export default SabotageTask;
