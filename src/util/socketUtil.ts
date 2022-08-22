import { Server, Socket } from "socket.io";

export class SocketUtil {
  private readonly server;
  constructor(io: Server) {
    this.server = io;
  }
  public CreateNamespace() {}
  public CreateRoom() {}
  public JoinRoom() {}
  public LeaveRoom() {}
  public deleteRoom() {}
  public deleteNamespace() {}
  public sendMessageInRoomToAll() {}
  public sendMessageInRoom() {}
  public broadcastMessageInRoom() {}
  public broadcastMessageInNamespace() {}
}
