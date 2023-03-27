
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('https://guess-the-caption-server.glitch.me')




function Home({data} : {data:any}){

    useEffect(() => {
        socket.on('send-chat', ({message}) => {
            printMessage(message)
        })




        return () => {
            socket.off('send-chat')
        }
    }, [])


    return(
        <div>
            {/* <h1>{data.title}</h1>
            <img src={data.url}></img> */}
                <input type="text" id="msg"></input>
                <div id="chatlog"></div>
        </div>
    )
}

function printMessage(msg:string | null | undefined){
    const newMsg = document.createElement("div")
    if (msg){
        newMsg.textContent = msg
    }
    const parent = typeof document !== 'undefined' && document.getElementById("chatlog")
    if (parent){
        parent.appendChild(newMsg)
    }
}



var msgBox = typeof document !== 'undefined' && document.getElementById("msg")
if (msgBox){
    msgBox.addEventListener("keypress", function(event:any){
        if (event.key === "Enter" && msgBox){
            var value = (msgBox as HTMLInputElement).value
            sendChat(value);
            (msgBox as HTMLInputElement).value = ''
        }
    })
}

function sendChat(message:string | null | undefined){
    printMessage(message)
    socket.emit('send-chat', ({message}))
}

export async function getServerSideProps() {

        var title
        var url
        await fetch('https://www.reddit.com/r/notdisneyvacation/random.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {

            title = myJson[0].data.children[0].data.title
            url = myJson[0].data.children[0].data.url
        });
  
        const data = { title, url }
    // Pass data to the page via props
    return { props: { data } }
  }

export default Home