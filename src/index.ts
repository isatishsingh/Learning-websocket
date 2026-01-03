import { WebSocketServer } from "ws";

const ws = new WebSocketServer({port:8080});

ws.on("connection",function(socket){
    console.log("Hello Connection happened");
    socket.send("Hello, we're from server side, we came here to help you");
});
