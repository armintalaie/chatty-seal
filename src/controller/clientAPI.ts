import express from "express";
import { Configration } from "../model/configuration";
import { spaceManager } from "../index";
import { IUser, Room } from "../model/roomHandler";
import { SpaceI } from "../model/space";

const router = express.Router();

router.post("/", (req, res) => {
  const domainName: string = req.body.name;
  const spaceInfo = spaceManager.createSpace(domainName);
  res.status(200).send(spaceInfo);
});

router.get("/", (req, res) => {
  res.status(200).send(spaceManager.getSpaces());
});

router.get("/:id", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const spaceInfo = spaceManager.getSpace(domainId).getSpaceInfo();
    res.status(200).send(spaceInfo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/:id", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const clientSecret: string | undefined = req.body.clientSecret;
    const spaceInfo = spaceManager
      .getSpace(domainId)
      .getSpaceInfo(clientSecret);
    res.status(200).send(spaceInfo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const clientSecret: string = req.body.clientSecret;
    spaceManager.deleteSpace(domainId, clientSecret);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/:id/configuration", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const space: SpaceI = spaceManager.getSpace(domainId);
    const configuration: Configration = space.getSpaceConfiguration();
    res.send(configuration);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id/configuration", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const newConfiguration = req.body.configuration;
    const clientSecret: string = req.body.clientSecret;

    const space = spaceManager.getSpace(domainId);
    space.updateSpaceConfiguration(newConfiguration, clientSecret);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id/rooms", (req, res) => {
  const domainId: string = req.params.id;
  const rooms: Room[] = spaceManager.getSpace(domainId).getRooms();
  //const user: IUser = { ...req.body };
  //  spaceManager.getSpace(domainId).joinRoom(user, roomId);
  res.send(rooms);
});

router.post("/:id/rooms", (req, res) => {
  const domainId: string = req.params.id;
  const roomId = spaceManager.getSpace(domainId).createRoom(req.body.name);
  // const user: IUser = { ...req.body };
  //  spaceManager.getSpace(domainId).joinRoom(user, roomId);
  res.send({ room: roomId });
});

router.get("/:spaceid/rooms/:roomid", (req, res) => {
  const domainId: string = req.params.spaceid;
  const roomId: string = req.params.roomid;
  res.send(roomId);
});

router.post("/:spaceid/rooms/:roomid/users", (req, res) => {
  const domainId: string = req.params.spaceid;
  const roomId: string = req.params.roomid;
  const user: IUser = { ...req.body };
  // spaceManager.getSpace(domainId).joinRoom(user, roomId);
  res.send({ room: roomId });
});

export { router };
