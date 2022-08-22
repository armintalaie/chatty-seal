import { Limitation } from "./limitation";
import { v4 as uuidv4 } from "uuid";
import { Configration } from "./configuration";
import { Namespace, Socket } from "socket.io";
import { IUser, Room } from "../roomHandler";
import { DEFAULT_CONFIG, DEFAULT_LIMITATION } from "../constants";

export interface SpaceInfo {
  domainId: string;
  name: string;
  clientSecret?: string;
  configuration: Configration;
  limitation: Limitation;
  rooms: string[];
}

export interface ISpace {
  domainId: string;
  createRoom(name: string): string;
  getRooms(): Room[];
  getRoom(roomId: string): Room;
  joinRoom(user: IUser, roomId: string, socket: Socket): void;
  deleteRoom(roomId: string): void;
  getSpaceConfiguration(): Configration;
  updateSpaceConfiguration(
    configuration: Configration,
    clientSecret: string
  ): void;
  getSpaceInfo(clientSecret?: string): SpaceInfo;
  getSpaceSecret(): string;
  sendMessage(roomId: string, userId: string, message: string): void;
}

export class Space implements ISpace {
  private namespace: Namespace;
  domainId: string;
  private name: string;
  private clientSecret: string;
  private configuration: Configration;
  private limitation: Limitation;
  private rooms: Room[] = [];

  getSpaceSecret() {
    return this.clientSecret;
  }

  constructor(name: string, id: string, namespace: Namespace) {
    this.name = name;
    this.domainId = id;
    this.clientSecret = uuidv4();
    this.configuration = Object.assign({}, DEFAULT_CONFIG);
    this.limitation = Object.assign({}, DEFAULT_LIMITATION);
    this.namespace = namespace;
    this.handleSpaceConnections();
  }

  getRooms(): Room[] {
    return this.rooms.map((room) => room.getRoomInfo());
  }

  public sendMessage(roomId: string, message: string) {
    const messageToSend = {
      text: message,
      date: Date(),
      username: this.domainId,
      displayName: this.name,
    };
    this.namespace.in(roomId).emit("message", messageToSend);
  }

  handleSpaceConnections() {
    this.namespace.on("connection", async (socket) => {
      socket.on("room:leave", (roomId) => {
        this.leaveRoom(roomId, socket);
      });

      socket.on("rooms", (domainId) => {
        socket.emit("rooms", this.getRooms());
      });

      socket.on("room", (args) => {
        let roomId;
        if (!args.roomId) {
          roomId = this.createRoom(args.roomName);
        } else {
          roomId = args.roomId;
        }
        this.joinRoom({ name: args.name, id: socket.id }, roomId, socket);
        socket.emit("room", {
          roomId: roomId,
          name: this.getRoom(roomId).name,
        });
        this.namespace.emit("rooms", this.getRooms());
      });

      socket.on("message", (domainId, roomId, message) => {
        const messageToSend2 = {
          text: message,
          date: Date(),
          username: "USER",
          displayName: "USER",
        };
        socket.to(roomId).emit("message", messageToSend2);
      });
    });
  }

  getSpaceInfo(clientSecret?: string): SpaceInfo {
    return {
      domainId: this.domainId,
      name: this.name,
      configuration: this.configuration,
      limitation: this.limitation,
      rooms: this.rooms.map((room) => room.getRoomInfo()),
      ...(clientSecret === this.clientSecret && {
        clientSecret: this.clientSecret,
      }),
    };
  }

  createRoom(name: string): string {
    const roomId = uuidv4();
    const newRoom = new Room(roomId, name);
    this.rooms.push(newRoom);
    return newRoom.id;
  }

  deleteRoom(roomId: string): void {
    this.namespace.in(roomId).disconnectSockets(true);
    this.rooms = this.rooms.filter((room) => room.id !== roomId);
  }

  getRoom(roomId: string): Room {
    return this.rooms.find((room) => room.id === roomId)!;
  }

  joinRoom(user: IUser, roomId: string, socket: Socket): void {
    const room = this.rooms.find((room) => room.id === roomId)!;
    socket.join(room.id);
    room.addUser(user);
  }

  leaveRoom(roomId: string, socket: Socket): void {
    const room: Room | undefined = this.rooms.find(
      (room) => room.id === roomId
    );
    if (!room) {
      throw new Error("NO room found");
    }
    room.deleteUser(socket.id);
    socket.leave(roomId);
    if (room.getUsers().length === 0) {
      this.deleteRoom(room.id);
    }
    this.namespace.emit("rooms", this.getRooms());
  }

  getSpaceConfiguration(): Configration {
    return this.configuration;
  }

  updateSpaceConfiguration(configuration: Configration, clientSecret: string) {
    if (clientSecret !== this.clientSecret) {
      throw new Error("Not Authorized");
    }
    this.configuration = Object.assign(this.configuration, configuration);
  }
}
