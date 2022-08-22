import { SocketUtil } from "../util/socketUtil";
import { Configration } from "./configuration";
import { Server } from "socket.io";
import { Space, SpaceI, SpaceInfo } from "./space";
import { v4 as uuidv4 } from "uuid";
export interface ISpaceManager {
  createSpace(domainId: string): SpaceInfo;
  deleteSpace(domainId: string, clientSecret: string): void;
  getSpace(domainId: string): SpaceI;
  getSpaces(): string[][];
  getSpaceConfiguration(domainId: string): Configration;
  updateSpaceConfiguration(
    domainId: string,
    newConfiguration: Configration
  ): Configration;
}

export class SpaceManager implements ISpaceManager {
  private spaces: SpaceI[] = [];
  private readonly MAIN_SPACE = "MAIN_SPACE";
  private socketUtil: SocketUtil;
  private readonly server: Server;

  constructor(server: Server) {
    this.server = server;
    this.socketUtil = new SocketUtil(server);
    const id = uuidv4();
    const space: SpaceI = new Space(
      this.MAIN_SPACE,
      id,
      this.server.of(`/${this.MAIN_SPACE}`)
    );
    this.spaces.push(space);
    this.handleSpaceConnections();
  }

  public createSpace(domainname: string) {
    const id = uuidv4();
    const namespace = this.server.of(`/${id}`);
    const space: SpaceI = new Space(domainname, id, namespace);
    this.spaces.push(space);
    return space.getSpaceInfo(space.getSpaceSecret());
  }

  public deleteSpace(domainId: string, clientSecret: string) {
    this.spaces = this.spaces.filter(
      (space) =>
        !(
          space.domainId === domainId && space.getSpaceSecret() === clientSecret
        )
    );
  }

  getSpaces(): string[][] {
    return this.spaces.map((space) => [
      space.domainId,
      space.getSpaceInfo().name,
      space.getSpaceInfo().rooms.length.toString(),
    ]);
  }

  getSpace(domainId: string): SpaceI {
    if (domainId === this.MAIN_SPACE) return this.spaces[0];
    const space: SpaceI | undefined = this.spaces.find(
      (space) => space.domainId === domainId
    );
    if (space) {
      return space;
    } else {
      throw new Error("No Space associated with that domain id");
    }
  }

  public getSpaceConfiguration(domainId: string): Configration {
    return this.getSpace(domainId).getSpaceConfiguration();
  }

  handleSpaceConnections() {
    this.server.on("connection", async (socket) => {
      socket.on("message", (domainId, roomId, message) => {
        const messageToSend2 = {
          text: message,
          date: Date(),
          username: "userId",
          displayName: "aaE",
        };
        socket.in;
        this.getSpace(domainId).sendMessage(roomId, socket.id, message);
        socket.to(roomId).emit("message", messageToSend2);
        //  socket.in(roomId).emit("message", messageToSend);
      });
    });
  }

  public updateSpaceConfiguration(
    domainId: string,
    newConfiguration: Configration
  ): Configration {
    // this.getAdminSpace(domainId).updateSpaceConfiguration(newConfiguration);
    return this.getSpace(domainId).getSpaceConfiguration();
  }
}
