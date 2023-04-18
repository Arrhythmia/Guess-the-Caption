
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('localhost:4000')

type MainPageProps = {
    handleCreateLobby: () => void;
    handleJoinLobby: () => void;
    setLobbyCode: React.Dispatch<React.SetStateAction<string>>;
}
export default function Home({ handleCreateLobby, handleJoinLobby, setLobbyCode }: MainPageProps) {
    return (
        
        <>
          <h1>Create or Join a Lobby</h1>
          <button onClick={handleCreateLobby}>Create Lobby</button>
          <div>
            <label htmlFor="lobbyCode">Lobby Code:</label>
            <input
              type="text"
              id="tempLobbyCode"
              onChange={(e) => setLobbyCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() }}}
            />
            <button onClick={handleJoinLobby}>Join Lobby</button>
          </div>
        </>
    );
};