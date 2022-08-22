import { Server, Socket } from "socket.io";
import { SpaceManager, ISpaceManager } from "../model/spaceManager";

export interface ChatServerInterface {
  handleMessageRequest(roomId: string, socket: Socket, message: string): void;
  run(): void;
}

export enum EVENTS {
  MESSAGE = "message",
}
export interface Message {
  text: string;
  date: string;
  username: string;
  displayName: string;
}
export interface User {
  userId: string;
  displayName: string;
}

export interface RoomRequest {
  roomId?: string;
  displayName?: string;
  roomToken: number;
}

export class ChatServer implements ChatServerInterface {
  private readonly io: Server;
  private spaceManager: ISpaceManager;

  constructor(io: Server, spaceManager: ISpaceManager) {
    this.io = io;
    this.spaceManager = spaceManager;
  }

  run() {
    this.io.on("connection", (socket) => {
      socket.on("message", (roomId, message) =>
        this.handleMessageRequest(roomId, socket, message)
      );
    });
  }

  handleMessageRequest(roomId: string, socket: Socket, message: string) {
    socket.in(roomId).emit("message", message);
  }
}
