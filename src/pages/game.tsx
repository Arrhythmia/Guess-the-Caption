type GameProps = {
    socket: any;
    lobbyCode: string;
}


import { useEffect, useState } from 'react'
import { myself } from './api/localPlayer';

export default function Home({ socket, lobbyCode }: GameProps) {

    const [imageData, setImageData] = useState<{ title: string; url: string }>();
    const [entry, setEntry] = useState<string>();
    const [gameStarted, setGameStarted] = useState<boolean>(false);

    function handleRequestImage() {
        socket.emit('requestImage', lobbyCode);
    }

    function handleStartGame() {
        socket.emit('startGame', lobbyCode);
    }

    function handleSubmitEntry(){
        socket.emit('submitEntry', {player:myself, entry})
    }

    useEffect(() => {
        console.log(imageData)
        socket.on('newImage', (data: { title: string; url: string }) => {
            setImageData(data);
        })
        socket.on('gameStarted', () => {
            setGameStarted(true);
        })
    })


    return (
        <div>
            {!gameStarted ? (<>
                <button onClick={handleRequestImage}>Image</button>
                <button onClick={handleStartGame}>Start</button>
            </>) : (imageData ? (
                <>
                    <h1>{imageData.title}</h1>
                    <img src={imageData.url}></img>
                    <input
                        type="text"
                        onChange={(e) => setEntry(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleSubmitEntry() } }}
                    />
                </>) : (<></>))}

        </div>
    )
}