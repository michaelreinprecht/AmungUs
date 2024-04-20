import React from 'react';
import { Lobby } from './scenes/SelectLobbyScene';

type LobbyListItemProps = {
    lobby: Lobby;
};

export default function LobbyListItem({ lobby }: LobbyListItemProps) {
    return (
        <a href={`/lobby/${lobby.lobbyCode}`}>
            <div className="border rounded-md mb-2 p-4 bg-gray-800 text-white flex flex-col">
                <h1 className="text-xl font-bold mb-2 text-white">Lobby Code: {lobby.lobbyCode}</h1>
                <div className="flex justify-between text-sm">
                    <p>Is Game Running: {lobby.isGameRunning ? 'Yes' : 'No'}</p>
                    <p>Player Count: {lobby.playerCount}/{lobby.maxPlayerCount}</p>
                </div>
            </div>
        </a>
    );
}
