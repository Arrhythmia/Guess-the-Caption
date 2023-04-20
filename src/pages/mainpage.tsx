import { useEffect, useState } from 'react';
import { setPlayerName, myself } from './localPlayer';

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
    socket.emit('createLobby', (myself));
  };

  const handleJoinLobby = () => {
    setPlayerName(username);
    socket.emit('joinLobby', { lobbyCode, player:myself });
  };

  useEffect(() => {
    setPlayerName(username);
  }, [username]);

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