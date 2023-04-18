type ChatProps = {
    socket: any
    lobbyCode: string
}
import { useEffect, useState } from 'react';
export default function Home({ socket, lobbyCode }: ChatProps) {
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleSendMessage = () => {
        socket.emit('sendMessage', { sender: socket.id, message: inputValue, lobbyCode });
        setInputValue('');
      };


      useEffect(() => {

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