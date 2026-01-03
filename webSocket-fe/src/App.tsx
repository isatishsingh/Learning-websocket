import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState();
  const inputRef = useRef();

  function sendMessage(){

    if(!socket) return;

    const message = inputRef.current.value;
    //@ts-ignore
    socket.send(message);
  }

  useEffect(()=>{
    const ws = new  WebSocket("ws://localhost:8080");

    //@ts-ignore
    setSocket(ws);

    ws.onmessage = (e) =>{
      alert(e.data);
    }

  },[])

  return (
    <div>
      <input ref={inputRef} type='text' name='message box'></input>
      <button type='submit' onClick={sendMessage}>Send</button>
    </div>
  )
}

export default App
