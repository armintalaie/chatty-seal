import { Db, MongoClient } from "mongodb";
import { Server } from "socket.io";
import { Configration } from "../model/spaceInfo/configuration";
import { SpaceInfo, ISpace, Space } from "../model/spaceInfo/space";
import { v4 as uuidv4 } from "uuid";

export interface ISpaceManager {
  createSpace(domainId: string): SpaceInfo;
  deleteSpace(domainId: string, clientSecret: string): void;
  getSpace(domainId: string, clientSecret?: string): Promise<SpaceInfo>;
  getSpaces(): Promise<SpaceInfo[]>;
  getSpaceConfiguration(domainId: string): Promise<Configration>;
  updateSpaceConfiguration(
    domainId: string,
    newConfiguration: Configration
  ): Promise<Configration>;
}

export class SpaceManager implements ISpaceManager {
  private activeSpaces: { [key: string]: ISpace } = {};
  private readonly MAIN_SPACE = "NOW";
  private readonly server: Server;
  private readonly db: Db;
  private spaceDB;

  constructor(server: Server) {
    const databse_uri: string = process.env.DB!;
    this.db = new MongoClient(databse_uri).db("chatty-seal");
    this.spaceDB = this.db.collection<SpaceInfo>("spaces");
    this.server = server;
    this.handleSpaceConnections();
  }

  public createSpace(domainname: string) {
    const id = uuidv4();
    const namespace = this.server.of(`/${id}`);
    const space: ISpace = new Space(domainname, id, namespace);
    this.activeSpaces[id] = space;

    this.spaceDB.insertOne(space.getSpaceInfo(space.getSpaceSecret()));
    return space.getSpaceInfo(space.getSpaceSecret());
  }

  public deleteSpace(domainId: string, clientSecret: string) {
    this.spaceDB.deleteOne({ domainId: domainId, clientSecret: clientSecret });
  }

  async getSpaces(): Promise<SpaceInfo[]> {
    return await this.spaceDB
      .find()
      .project<SpaceInfo>({ _id: 0, name: 1, domainId: 1, rooms: 1 })
      .toArray();
  }

  async getSpace(domainId: string, clientSecret?: string): Promise<SpaceInfo> {
    const space = await this.spaceDB.findOne<SpaceInfo>(
      {
        domainId: domainId,
        ...(clientSecret && {
          clientSecret: clientSecret,
        }),
      },
      {
        projection: {
          _id: 0,
          clientSecret: clientSecret !== undefined,
        },
      }
    );

    if (!space) {
      throw new Error("No Space associated with that domain id and/or passkey");
    }
    return space;
  }

  public async getSpaceConfiguration(domainId: string): Promise<Configration> {
    return (await this.getSpace(domainId)).configuration;
  }

  handleSpaceConnections() {
    this.server.on("connection", async (socket) => {
      socket.on("message", (domainId, roomId, message) => {});
    });
  }

  public async updateSpaceConfiguration(
    domainId: string,
    newConfiguration: Configration
  ): Promise<Configration> {
    // (await this.getSpace(domainId)).updateSpaceConfiguration(newConfiguration);
    return (await this.getSpace(domainId)).configuration;
  }
}
