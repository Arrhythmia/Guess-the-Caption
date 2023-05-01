type GameProps = {
    socket: any;
    lobbyCode: string;
}


import { useEffect, useState } from 'react'
import { myself, Player } from './api/localPlayer';

export default function Home({ socket, lobbyCode }: GameProps) {

    const [imageData, setImageData] = useState<{ title: string; url: string }>();
    const [entry, setEntry] = useState<string>();
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<boolean>(false);
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [hasPressed, setHasPressed] = useState<boolean>(false);
    const [playerEntries, setPlayerEntries] = useState<Map<Player, string>>();

    function handleRequestImage() {
        socket.emit('requestImage', lobbyCode);
    }

    function handleStartGame() {
        socket.emit('startGame', lobbyCode);
    }

    function handleSubmitEntry() {
        socket.emit('submitEntry', { player: myself, entry })
        setEntry('');
    } 

    function handleKeyDown() {
        if (!hasPressed) {
            handleSubmitEntry();
        }
        setHasPressed(true);
    }
    function handleKeyUp() {
        setHasPressed(false);
    }

    function handleVote(votee: Player) {
        const voterId = myself.clientId;
        const voteeId = votee.clientId;
        socket.emit('playerVoted', { voterId, voteeId })
        setHasVoted(true);
    }

    useEffect(() => {
        socket.on('newImage', (data: { title: string; url: string }) => {
            setImageData(data);
        })
        socket.on('gameStarted', () => {
            setGameStarted(true);
        })
        socket.on('result', (data: { imageUrl: string, playerEntries: string }) => {
            //setGameStarted(false);
            const newPlayerEntries = new Map<Player, string>(JSON.parse(data.playerEntries))
            setGameResult(true);
            setImageData({title: '', url: data.imageUrl});
            setPlayerEntries(newPlayerEntries);
            setHasVoted(false);
            console.log(newPlayerEntries)
        })


        return () => {
            socket.off('newImage')
            socket.off('gameStarted')
            socket.off('result')
          };
    })


    return (
        <div>
            {!gameStarted ? (<>
                <button onClick={handleRequestImage}>Image</button>
                <button onClick={handleStartGame}>Start</button>
            </>) : (imageData && !gameResult ? (
                <>
                    <h1>{imageData.title}</h1>
                    <img src={imageData.url}></img>
                    <input
                        type="text"
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleKeyDown() } }}
                        onKeyUp={(e) => { if (e.key === 'Enter') { handleKeyUp() } }}
                    />
                </>) : (<></>))}
            {gameResult && imageData && playerEntries ? (<>
                <img src={imageData.url}></img>
                {Array.from(playerEntries).map(([player, entry]) => (
                    <div key={player.clientId}>
                        <h3>{player.playerName}</h3>
                        <p>{entry}</p>
                        {!hasVoted ? (<><button onClick={() => handleVote(player)}>Vote</button></>) : (<></>)}
                    </div>
                ))}
            </>) : (<></>)}

        </div>
    )
}