import { useEffect, useRef, useState } from "react";


export const PreviousChatBox = () => {
  const [ws, setWs] = useState();
  const [type, setType] = useState("");
  const modeRef = useRef();
  const roomRef = useRef();
  const chatRef = useRef();

  function setMode() {
    setType(modeRef.current?.value);
  }

  function sendMessage() {
    if (!ws) return;
    if (!modeRef.current) return;
    if (
      (type === "chat" && chatRef.current?.value === "") ||
      (type === "join" && roomRef.current?.value === "")
    ) {
      console.log("djwjfwfgweyfgw");
      return;
    }

    const obj = {
      type: modeRef.current?.value,
      payload: {
        roomId: roomRef.current?.value,
        message: chatRef.current?.value,
      },
    };

    //@ts-ignore
    ws.onopen = () =>{
      ws.send(JSON.stringify(obj));
    }
    if (type === "join")
      alert(`You've joined ${roomRef.current?.value} successfully`);
    setType("");
    
    roomRef.current.value = "";
    modeRef.current.value = "";
    if (chatRef.current) chatRef.current.value = "";
  }

  useEffect(() => {
    const webs = new WebSocket("ws://localhost:8080");

    //@ts-ignore
    setWs(webs);

    webs.onmessage = (ev) => {
      alert(ev.data);
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        ref={modeRef}
        name="messageBox"
        placeholder="mode or work"
      ></input>
      <button type="submit" onClick={setMode}>
        setMode
      </button>

      {type === "chat" && (
        <div>
          <input
            type="text"
            required={true}
            ref={chatRef}
            placeholder="enter Message"
          ></input>
          <button type="submit" onClick={sendMessage} name="sendButton">
            send
          </button>
        </div>
      )}

      {type === "join" && (
        <div>
          <input
            type="text"
            required={true}
            ref={roomRef}
            placeholder="Enter Room id"
          ></input>
          <button type="submit" onClick={sendMessage} name="sendButton">
            send
          </button>
        </div>
      )}
    </div>
  );
}

export default PreviousChatBox;
