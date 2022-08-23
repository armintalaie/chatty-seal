import express from "express";
import http from "http";
import { Server } from "socket.io";
import { router } from "./controller/api";
import cors from "cors";
import { SpaceManager, ISpaceManager } from "./controller/spaceManager";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

// Configure API
const app = express();
const allowedOrigins = ["https://chatty-seal-ui.herokuapp.com", "http://localhost:3000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use("/spaces", router);

// Start server
const port = process.env.PORT || 8080;
const databse_uri = process.env.DB;
const dbConection = new MongoClient(databse_uri!);
let spaceManager: ISpaceManager;

try {
  dbConection.connect().then((res) => {
    spaceManager = new SpaceManager(io, dbConection);
    server.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  });
} catch (e) {
  console.warn("Server crashed; urgently fix");
  console.error(e);
}

export { spaceManager };
