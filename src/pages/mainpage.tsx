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
    socket.emit('joinLobby', { lobbyCode, player: myself });
  };


  return (

    <>
      <div className="background">
        <div className="mainPageBox">
          <div className="usernameContainer">
            <label>Name:</label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() } }}
            />
          </div>
          <div className="logo"></div>
          <div className="createLobbyButtonContainer">
            <button onClick={handleCreateLobby}>Create Lobby</button>
          </div>
          <div className="joinLobbyButtonContainer">
            <button onClick={handleCreateLobby}>Join Lobby</button>
          </div>
          <div className="lobbyCodeContainer">
            <input
              type="text"
              onChange={(e) => setLobbyCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() } }}
            />
          </div>
        </div>
      </div>
    </>
  );
};