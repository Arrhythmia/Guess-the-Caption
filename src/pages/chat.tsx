
import ScrollToBottom from 'react-scroll-to-bottom';

type ChatProps = {
  socket: any
  lobbyCode: string
}



import { myself, Player } from './api/localPlayer';
import { useEffect, useState } from 'react';
export default function Home({ socket, lobbyCode }: ChatProps) {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = () => {
    socket.emit('sendMessage', { sender: myself, message: inputValue, lobbyCode });
    setInputValue('');
    scrollToBottom();
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
      scrollToBottom();
    });

    socket.on('newMessage', (data: { player: Player, message: string }) => {
      const senderName = data.player.playerName;
      const message = data.message
      const data2 = { sender: senderName, message: message }
      setMessages((prevMessages) => [...prevMessages, data2]);

      scrollToBottom();
    });

    socket.on('userLeft', (user: Player) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'system',
          message: `${user.playerName} has left the lobby`,
        },
      ]);
      scrollToBottom();
    });

    return () => {
      socket.off('newUser')
      socket.off('newMessage')
      socket.off('userLeft')
    };
  }, []);

  const chatContainer = document.querySelector<HTMLDivElement>('.chatContainer');

  function scrollToBottom() {
    if (chatContainer) {
      console.log(chatContainer.scrollHeight)
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  return (

    <>
      <div className="rightSideBar">
        <ScrollToBottom className="chatContainer">
          {messages.map((data, i) => (
            <div className="messageContainer" key={i}>
              {data.sender === 'system' ? (
                <i className="messageText">{data.message}</i>
              ) : (
                <>
                  {data.sender}: {data.message}
                </>
              )}
            </div>
          ))}

        </ScrollToBottom>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage() } }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
};