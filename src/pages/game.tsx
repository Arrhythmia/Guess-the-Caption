
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('localhost:4000')




export default function Home(){
    const [imageData, setImageData] = useState<{ title: string; url: string }>();

    function handleRequestImage(){
        socket.emit('requestImage');
    }

    useEffect(() => {
        socket.on('newImage', (data) => {
            setImageData(data);
        })
    })


    return(
        <div>
            <button onClick={handleRequestImage}>Image</button>
            {imageData ? (
            <>
            <h1>{imageData.title}</h1>
            <img src={imageData.url}></img>
            </>):(<></>)}
                <input type="text" id="msg"></input>
        </div>
    )
}