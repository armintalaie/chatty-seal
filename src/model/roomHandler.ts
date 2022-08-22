import { v4 as uuidv4 } from "uuid";
import { BroadcastOperator, Event, Socket } from "socket.io";
import { Message } from "../controller/chatServer";
import { stringify } from "querystring";

export class Room {
  private users: User[] = [];
  name: string = "Room";
  id: string;

  constructor(roomId: string, name: string) {
    this.id = roomId;
    this.name = name;
  }

  public getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }
  public deleteUser(userId: string) {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  public getRoomInfo(): any {
    return { name: this.name, id: this.id, users: this.users.length };
  }

  public addUser(user: IUser) {
    if (this.users.find((current) => current.id === user.id)) return;
    const newUser = new User();

    newUser.id = user.id;
    newUser.name = user.name;
    this.users.push(newUser);
  }

  public getUsers() {
    return this.users;
  }
}

class User {
  id: string = "";
  name: string = "";
}

export interface IUser {
  name: string;
  id: string;
}
