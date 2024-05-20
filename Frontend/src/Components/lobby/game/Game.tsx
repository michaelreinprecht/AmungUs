import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Background from './Background';
import PlayerCharacter from '../../player/PlayerCharacter';
import KillUI from './KillUI';
import PlayerCorpse from '@/Components/player/PlayerCorpse';
import VotingUI from './VotingUI';
import ChatWindow from '../chat/ChatWindow';
import { useGame } from './hooks/useGame';
import EmergencyButton from './EmergencyButton';
import TaskObject from '@/Components/task/TaskObject';
import ColorTask from '@/Components/task/ColorTask';
import Colliders from './Colliders';
import MemoryTask from '@/Components/task/MemoryTask';
import ReactionTask from '@/Components/task/ReactionTask';
import FindTask from '@/Components/task/FindTask';
import VotingKillUI from './VotingKillUI';
import GameOverUI from './GameOverUI';
import TaskList from '@/Components/task/TaskList';

type GameProps = {
  activePlayerName: string;
  activePlayerCharacter: string;
  lobbyCode: string;
};

export default function Game({
  activePlayerName,
  activePlayerCharacter,
  lobbyCode,
}: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    votingKill,
    isGamePaused,
    setIsGamePaused,
    isGameOver,
    setIsGameOver,
    nearestPlayer,
    setNearestPlayer,
    playerPositions,
    setPlayerPositions,
    isVotingActive,
    isKillEnabled,
    isKillUIVisible,
    currentTask,
    setCurrentTask,
    currentPlayerTasks,
    setCurrentPlayerTasks,
    winners,
    setWinners,
  } = useGame(activePlayerName, lobbyCode);

  return (
    <div ref={canvasRef} className="w-screen h-screen relative">
      <Canvas
        camera={{
          position: [0, 0, 32],
          zoom: 16,
          near: 0.1,
          far: 64,
          aspect: canvasRef.current
            ? canvasRef.current.clientWidth / canvasRef.current.clientHeight
            : undefined,
        }}
        orthographic
        gl={{ antialias: false }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <color attach="background" args={['#000000']} />
        {/* Ambient light and directional light */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />

        {/* Background component with overlay image */}
        <Background textureUrl="/AmungUsMap.png" />

        {/* Render player character */}
        <PlayerCharacter
          isGamePaused={isGamePaused}
          isGameOver={isGameOver}
          activePlayerName={activePlayerName}
          activePlayerCharacter={activePlayerCharacter}
          scale={5}
          lobbyCode={lobbyCode}
          onNearestPlayerChange={(playerName: string) => setNearestPlayer(playerName)}
          playerPositions={playerPositions}
          setPlayerPositions={setPlayerPositions}
        />

        <EmergencyButton
          position={{ x: 26, y: 74, z: 0 }}
          texturePath="/EmergencyButton.png"
          label=""
          scale={3}
          isGamePaused={false}
          activePlayerName={activePlayerName}
          lobbyCode={lobbyCode}
        />

        {/* Render player corpse */}
        <PlayerCorpse
          activePlayerName={activePlayerName}
          scale={5}
          lobbyCode={lobbyCode}
          playerPositions={playerPositions}
        />

        {/* Render task objects */}
        {currentPlayerTasks.map((task, index) => (
          <TaskObject
            key={index}
            position={[0, 25 + index * 5, 0]}
            scale={5}
            task={task}
            setCurrentTask={setCurrentTask}
            currentTask={currentTask}
          />
        ))}
      </Canvas>

      {/* Kill UI */}
      {isKillUIVisible() && !isVotingActive && (
        <KillUI
          isKillEnabled={isKillEnabled()}
          activePlayerName={activePlayerName}
          victimName={nearestPlayer}
          lobbyCode={lobbyCode}
        />
      )}

      {/* Voting UI */}
      {isVotingActive && (
        <VotingUI
          lobbyCode={lobbyCode}
          activePlayerName={activePlayerName}
          activePlayerCharacter={activePlayerCharacter}
        />
      )}

      {/* Render MessageForm and MessageList only if connected */}
      {isVotingActive && <ChatWindow activePlayerName={activePlayerName} lobbyCode={lobbyCode} />}

      {/* Tasks */}
      {currentTask.name === 'ColorTask' && <ColorTask setCurrentTask={setCurrentTask} setCurrentPlayerTasks={setCurrentPlayerTasks} currentTask={currentTask}/>}
      {currentTask.name === 'MemoryTask' && <MemoryTask setCurrentTask={setCurrentTask} setCurrentPlayerTasks={setCurrentPlayerTasks} currentTask={currentTask}/>}
      {currentTask.name === 'ReactionTask' && <ReactionTask setCurrentTask={setCurrentTask} setCurrentPlayerTasks={setCurrentPlayerTasks} currentTask={currentTask} />}
      {currentTask.name === 'FindTask' && <FindTask setCurrentTask={setCurrentTask} setCurrentPlayerTasks={setCurrentPlayerTasks} currentTask={currentTask} />}

      <VotingKillUI votingKill={votingKill} />

      <GameOverUI
        winners={winners}
        setWinners={setWinners}
        setIsGameOver={setIsGameOver}
      />

        {/* Task List UI */}
        <div className="task-list-ui absolute top-0 left-0 p-4 bg-gray-800 text-white">
            <TaskList tasks={currentPlayerTasks} />
        </div>
    </div>
  );
}
