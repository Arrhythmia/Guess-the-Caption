import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { myself, setClientId } from './api/localPlayer';

const Game = dynamic(() => import('./game'));


const MainPage = dynamic(() => import('./mainpage'))
const Chat = dynamic(() => import('./chat'))


export default function Home() {
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [isInLobby, setIsInLobby] = useState<boolean>();
  const [username, setUsername] = useState<string>('sbeve');

  let socket = io(process.env.NODE_ENV === 'production' ? 'guess-the-caption-server.glitch.me' : 'localhost:4000');

  useEffect(() => {
    socket.connect();
    
    socket.on('lobbyCreated', (code: string) => {
      setIsInLobby(true);
      setLobbyCode(code);
    });
    socket.on('joinedLobby', () => {
      setIsInLobby(true);
    });
    socket.on('invalidLobby', () => {
      setIsInLobby(false);
      alert('Invalid lobby code');
    });
    socket.on('invalidName', () => {
      setIsInLobby(false);
      alert('Invalid name');
    });

    return () => {
      socket.off('lobbyCreated')
      socket.off('joinedLobby')
      socket.off('invalidLobby')
      socket.off('invalidName')
      socket.disconnect()
    };
  }, []);



  return (
    <div>
      {isInLobby ? (
        <>
          <h1>Lobby {lobbyCode}</h1>

          <Chat socket={socket} lobbyCode={lobbyCode}></Chat>

          <Game socket={socket} lobbyCode={lobbyCode}></Game>
        </>
      ) : (
        <MainPage socket={socket}
        lobbyCode={lobbyCode}
        setLobbyCode={setLobbyCode}
        username={username}
        setUsername={setUsername}></MainPage>
      )}
    </div>
  );
}
