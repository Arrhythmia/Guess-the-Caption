import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import dynamic from 'next/dynamic';

const Game = dynamic(() => import('./game'));


const MainPage = dynamic(() => import('./mainpage'))

const socket = io('localhost:4000');

export default function Home() {
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [isInLobby, setIsInLobby] = useState<boolean>();
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleCreateLobby = () => {
    socket.emit('createLobby');
  };

  const handleJoinLobby = () => {
    socket.emit('joinLobby', lobbyCode);
  };


  const handleSendMessage = () => {
    socket.emit('sendMessage', { sender: socket.id, message: inputValue, lobbyCode });
    setInputValue('');
  };

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

    socket.on('newUser', (userId: string) => {
      console.log("SOMEONE JOINED!")
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: `${userId} has joined the lobby`,
        },
      ]);
    });

    socket.on('newMessage', (data: { sender: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('userLeft', (userId: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: `${userId} has left the lobby`,
        },
      ]);
    });


    



    return () => {
      socket.off('lobbyCreated')
      socket.off('invalidLobby')
      socket.off('newUser')
      socket.off('newMessage')
      socket.off('userLeft')
      
      socket.disconnect();
    };
  }, []);



  return (
    <div>
      {isInLobby ? (
        <>
          <Game></Game>
          <h1>Lobby {lobbyCode}</h1>
          <ul>
            {messages.map((data, i) => (
              <li key={i}>
                {data.sender === 'system' ? (
                  <i>{data.message}</i>
                ) : (
                  <>
                    {data.sender}: {data.message}
                  </>
                )}
              </li>
            ))}
          </ul>
          <input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage() }}} 
          />
          <button onClick={handleSendMessage}>Send</button>
        </>
      ) : (
        <MainPage handleCreateLobby={handleCreateLobby}
        handleJoinLobby={handleJoinLobby}
        setLobbyCode={setLobbyCode}></MainPage>
      )}
    </div>
  );
}
