import express from "express";
import { spaceManager } from "..";
import { IUser } from "../model/roomHandler";
import { SpaceInfo } from "../model/spaceInfo/space";

// API Routes with <spaces> prefix; e.g. <BASE_URL>/spaces/<>
const router = express.Router();

router.post("/", (req, res) => {
  try {
    const domainName: string = req.body.name;
    const spaceInfo = spaceManager.createSpace(domainName);
    res.status(200).send(spaceInfo);
  } catch (e) {
    res.send(400).send(e);
  }
});

router.get("/", async (req, res) => {
  const spaces = await spaceManager.getSpaces();
  res.status(200).send(spaces);
});

router.get("/:id", async (req, res) => {
  try {
    const domainId: string = req.params.id;
    const clientSecret: string | undefined = req.body.clientSecret;
    const space = await spaceManager.getSpace(domainId, clientSecret);
    res.status(200).send(space);
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

router.post("/:id", async (req, res) => {
  try {
    const domainId: string = req.params.id;
    const clientSecret: string | undefined = req.body.clientSecret;
    const spaceInfo = await spaceManager.getSpace(domainId, clientSecret);
    res.status(200).send(spaceInfo);
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

router.delete("/:id", (req, res) => {
  try {
    const domainId: string = req.params.id;
    const clientSecret: string = req.body.clientSecret;
    spaceManager.deleteSpace(domainId, clientSecret);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

router.get("/:id/configuration", async (req, res) => {
  try {
    const domainId: string = req.params.id;
    const space: SpaceInfo = await spaceManager.getSpace(domainId);
    res.send(space.configuration);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put("/:id/configuration", async (req, res) => {
  try {
    const domainId: string = req.params.id;
    const newConfiguration = req.body.configuration;
    const clientSecret: string = req.body.clientSecret;

    const space: SpaceInfo = await spaceManager.getSpace(domainId);
    //space.updateSpaceConfiguration(newConfiguration, clientSecret);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.get("/:id/rooms", (req, res) => {
//   const domainId: string = req.params.id;
//   // const rooms: Room[] = spaceManager.getSpace(domainId).getRooms();
//   //const user: IUser = { ...req.body };
//   //  spaceManager.getSpace(domainId).joinRoom(user, roomId);
//   // res.send(rooms);
// });

// router.post("/:id/rooms", (req, res) => {
//   const domainId: string = req.params.id;
//   // const roomId = spaceManager.getSpace(domainId).createRoom(req.body.name);
//   // const user: IUser = { ...req.body };
//   //  spaceManager.getSpace(domainId).joinRoom(user, roomId);
//   //res.send({ room: roomId });
// });

// router.get("/:spaceid/rooms/:roomid", (req, res) => {
//   const domainId: string = req.params.spaceid;
//   const roomId: string = req.params.roomid;
//   res.send(roomId);
// });

// router.post("/:spaceid/rooms/:roomid/users", (req, res) => {
//   const domainId: string = req.params.spaceid;
//   const roomId: string = req.params.roomid;
//   const user: IUser = { ...req.body };
//   // spaceManager.getSpace(domainId).joinRoom(user, roomId);
//   res.send({ room: roomId });
// });

export { router };
