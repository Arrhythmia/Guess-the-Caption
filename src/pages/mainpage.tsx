import { useEffect, useState } from 'react';
import { setClientId, setPlayerName, myself } from './api/localPlayer';
import { useRef } from 'react';

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

  const lobbyCodeTextBox = useRef<HTMLInputElement>(null);
  const handleHoverOVerJoin = () => {
    lobbyCodeTextBox.current?.focus();
  }

  return (

    <>
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
        <div className="buttonsContainer">
          <div className="createLobbyButtonContainer">
            <button onClick={handleCreateLobby}>Create Lobby</button>
          </div>
          <div className="joinLobbyContainer">
            <div className="joinLobbyButtonContainer">
              <button onClick={handleJoinLobby} onMouseOver={handleHoverOVerJoin} className="joinLobbyButton">Join Lobby</button>

            </div>
            <input
              type="text"
              onChange={(e) => setLobbyCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJoinLobby() } }}
              placeholder="Lobby"
              className="lobbyCode"
              ref={lobbyCodeTextBox}
              maxLength={6}
            />
          </div>
        </div>
      </div>
    </>
  );
};