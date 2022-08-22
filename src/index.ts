import express from "express";
import http from "http";
import { Server } from "socket.io";
import { router } from "./controller/clientAPI";
import cors from "cors";
import { SpaceManager, ISpaceManager } from "./model/spaceManager";
import { ChatServer, ChatServerInterface } from "./controller/chatServer";

const app = express();
const allowedOrigins = [
  "https://chatty-seal-ui.herokuapp.com",
  "http://localhost:3000",
];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());
const port = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const spaceManager: ISpaceManager = new SpaceManager(io);
const chatServer: ChatServerInterface = new ChatServer(io, spaceManager);
chatServer.run();

app.use("/spaces", router);

// start the express server
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
export { spaceManager };
