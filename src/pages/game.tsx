type GameProps = {
    socket: any;
    lobbyCode: string;
}


import { useEffect, useState } from 'react'

export default function Home({ socket, lobbyCode }: GameProps){
    const [imageData, setImageData] = useState<{ title: string; url: string }>();

    function handleRequestImage(){
        socket.emit('requestImage', lobbyCode);
    }

    function handleStartGame(){
        socket.emit('startGame', lobbyCode);
    }

    useEffect(() => {
        socket.on('newImage', (data: { title: string; url: string }) => {
            setImageData(data);
        })
    })


    return(
        <div>
            <button onClick={handleRequestImage}>Image</button>
            <button onClick={handleStartGame}>Start</button>
            {imageData ? (
            <>
            <h1>{imageData.title}</h1>
            <img src={imageData.url}></img>
            </>):(<></>)}
        </div>
    )
}