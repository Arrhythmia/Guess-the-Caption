import { useState } from 'react';
import { useRouter } from 'next/router';

export default function JoinLobby() {
  const router = useRouter();
  const [code, setCode] = useState('');

  // Handle joining a lobby
  const joinLobby = () => {
    router.push(`/Lobby?code=${code}`);
  };

  const generateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const createLobby = () => {
    let code = generateCode();
    router.push(`/Lobby?code=${code}`);
  }

  return (
    <div>
        <h1>Join Lobby</h1>
        <div>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={joinLobby}>Join</button>
        </div>
        <h1>Create Lobby</h1>
        <button onClick={createLobby}>Create</button>
    </div>
);
}