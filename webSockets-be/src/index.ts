import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

interface User {
  socket: any;
  room: string;
}

let allSocket: User[] = [];

ws.on("connection", function (socket) {
  console.log("Hello Connection happened");

  socket.on("message", (message) => {
    const parsedData = JSON.parse(message.toString());

    if (parsedData.type === "join") {
      allSocket.push({
        socket,
        room: parsedData.payload.roomId,
      });
    } else if (parsedData.type === "chat") {
        let currentUserRoom : string | undefined  = undefined;
        allSocket.map(item =>{
            if(item.socket === socket){
                currentUserRoom =  item.room;
            }
        })
        allSocket.map(item =>{
          if(item.room === currentUserRoom){
              item.socket.send(parsedData.payload.message);
          }
        })
    }
  });

});
