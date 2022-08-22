import express from "express";
import http from "http";
import { Server } from "socket.io";
import { router } from "./controller/api";
import cors from "cors";
import { SpaceManager, ISpaceManager } from "./controller/spaceManager";
import * as dotenv from "dotenv";
dotenv.config();

// Configure API
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

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const spaceManager: ISpaceManager = new SpaceManager(io);
app.use("/spaces", router);

// Start server
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
export { spaceManager };
