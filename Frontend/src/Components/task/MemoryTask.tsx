import { Task } from '@/app/types';
import React, { useState, useEffect } from 'react';

const symbols = ['🌟', '🍀', '🌈', '🦄', '🎈', '🎉', '🎁']; // Array of symbols for cards

interface MemoryTaskProps {
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  setCurrentPlayerTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentTask: Task;
  updateTask: (updatedTask: Task) => void;
}

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
}

function MemoryTask({ setCurrentTask, setCurrentPlayerTasks, currentTask, updateTask }: MemoryTaskProps) {
  const [cards, setCards] = useState<Card[]>(() => {
    // Load saved state from session storage, if available
    const savedState = sessionStorage.getItem(`MemoryTask-${currentTask.id}`);
    if (savedState) {
      const { cards } = JSON.parse(savedState);
      return cards;
    } else {
      // Generate initial state with shuffled pairs of symbols
      const shuffledSymbols = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
      return shuffledSymbols.map((symbol, index) => ({ id: index, symbol, flipped: false }));
    }
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // Array to hold currently flipped cards

  useEffect(() => {
    // Check if all cards are flipped
    const allFlipped = cards.every(card => card.flipped);
    if (allFlipped) {
      setCurrentPlayerTasks(prev => prev.map((task, i) => i === currentTask.id ? { ...task, completed: true } : task));
      updateTask(currentTask);
      setCurrentTask({id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: ""});
    }
  }, [cards, setCurrentTask]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return; // Allow only two cards to be flipped at a time

    const updatedCards = cards.map((card: Card) => {
      if (card.id === cardId && !card.flipped) {
        return { ...card, flipped: true }; // Flip the clicked card
      }
      return card;
    });

    setCards(updatedCards);

    // Add flipped card to the flippedCards array
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      // Check if the symbols of the flipped cards match
      const [firstCardId, secondCardId] = newFlippedCards;
      const matched = cards[firstCardId].symbol === cards[secondCardId].symbol;

      if (!matched) {
        // If symbols don't match, flip the cards back after a short delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card: Card) => {
              if (card.id === firstCardId || card.id === secondCardId) {
                return { ...card, flipped: false };
              }
              return card;
            })
          );
          setFlippedCards([]);
        }, 1000);
      } else {
        // If symbols match, play the sound
        playSound();
        setFlippedCards([]);
      }
    }
  };

  function playSound() {
    const audio = new Audio('/correct.mp3');
    audio.play();
  }

  // Save current progress to session storage
  useEffect(() => {
    sessionStorage.setItem(`MemoryTask-${currentTask.id}`, JSON.stringify({ cards, flippedCards }));
  }, [cards, flippedCards, currentTask.id]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 w-3/4 h-3/4 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-4">Memory Task</h1>
      <p className="text-white text-center mb-4">
        Click onto two cards and try to match their symbols.
      </p>
      <div className="flex flex-wrap justify-center">
        {cards.map(card => (
          <div
            key={card.id}
            className={`m-2 w-36 h-36 bg-blue-200 flex justify-center items-center rounded cursor-pointer text-4xl ${card.flipped ? 'pointer-events-none' : ''}`}
            onClick={() => handleCardClick(card.id)}
            style={{ backgroundColor: card.flipped ? 'white' : 'blue' }}
          >
            {card.flipped ? card.symbol : null}
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentTask({id: 0, name: "NoTask", completed: false, playerName: "", lobbyCode: ""})} className="mt-4 px-4 py-2 rounded bg-blue-500 text-white font-bold">
        Save & Exit
      </button>
    </div>
  );
}

export default MemoryTask;
