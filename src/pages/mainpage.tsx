import { useEffect, useState } from 'react';
import { setClientId, setPlayerName, myself } from './api/localPlayer';

type MainPageProps = {
  socket: any;
  lobbyCode: string;
  setLobbyCode: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}
export default function Home({ socket, lobbyCode, setLobbyCode, username, setUsername }: MainPageProps) {

  const handleCreateLobby = () => {
    setPlayerName(username);
    setClientId(socket.id);
    socket.emit('createLobby', (myself));
  };

  const handleJoinLobby = () => {
    setPlayerName(username);
    setClientId(socket.id);
    socket.emit('joinLobby', { lobbyCode, player:myself });
  };


  return (

    <>

      <label>Name:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() } }}
      />
      
      <h1>Create or Join a Lobby</h1>
      <button onClick={handleCreateLobby}>Create Lobby</button>
      <div>
        <label>Lobby Code:</label>
        <input
          type="text"
          onChange={(e) => setLobbyCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() } }}
        />
        <button onClick={handleJoinLobby}>Join Lobby</button>

      </div>
    </>
  );
};