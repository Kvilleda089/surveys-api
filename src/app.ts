import { Server } from "./presentation/server";



const server = new Server();
server.start().catch((error) =>{
    console.error(`Error while the server ${error}`);
});