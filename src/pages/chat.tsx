type ChatProps = {
    socket: any
    lobbyCode: string
}

interface Player{
  clientId: string;
  playerName: string;
}

import { myself } from './localPlayer';
import { useEffect, useState } from 'react';
export default function Home({ socket, lobbyCode }: ChatProps) {
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleSendMessage = () => {
        socket.emit('sendMessage', { sender: myself, message: inputValue, lobbyCode });
        setInputValue('');
      };


      useEffect(() => {

        socket.on('newUser', (player: Player) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: 'system',
                message: `${player.playerName} has joined the lobby`,
              },
            ]);
          });
      
          socket.on('newMessage', (data: {player:Player, message:string}) => {
            console.log(data)
            const senderName = data.player.playerName;
            const message = data.message
            const data2 = {sender: senderName, message: message}
            setMessages((prevMessages) => [...prevMessages, data2]);
          });
      
          socket.on('userLeft', (user: Player) => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                sender: 'system',
                message: `${user.playerName} has left the lobby`,
              },
            ]);
          });
    
        return () => {
          socket.off('newUser')
          socket.off('newMessage')
          socket.off('userLeft')
        };
      }, []);

    
    return (
        
        <>
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
    );
};