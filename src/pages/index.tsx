import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://guess-the-caption-server.glitch.me');

export default function Home() {
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [isInLobby, setIsInLobby] = useState<boolean>();
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleCreateLobby = () => {
    socket.emit('createLobby');
  };

  const handleJoinLobby = () => {
    setIsInLobby(true);
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
          <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </>
      ) : (
        <>
          <h1>Create or Join a Lobby</h1>
          <button onClick={handleCreateLobby}>Create Lobby</button>
          <div>
            <label htmlFor="lobbyCode">Lobby Code:</label>
            <input
              type="text"
              id="tempLobbyCode"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value)}
            />
            <button onClick={handleJoinLobby}>Join Lobby</button>
          </div>
        </>
      )}
    </div>
  );
}
