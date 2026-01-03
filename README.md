# Learning-websocket
# first initialize the empty directory with package.json
`npm init -y`

# install typeScript 
`npm i typescript`

# run command to initialize tsconfig.json file
`npx tsc --init`

# uncomment these two line of code and update tsConfig.json file
`
"rootDir": "./src", 
"outDir": "./dist",
`

# install websocket package from npm
`npm install ws @types/ws`

# write template code to run the server and connect with it
`
import { WebSocketServer } from "ws";

const ws = new WebSocketServer({port:8080});

ws.on("connection",function(socket){
    console.log("Hello, Connection happened");
    socket.send("Hello");
});
`
Now in Postman, in  my workspace section click on new and select websocket
and write the url ws://localhost:8080 and after pressing enter you will see the output hello in the postman output window.
# Note: we are writing 8080 because in the code we use 8080 as our port value
