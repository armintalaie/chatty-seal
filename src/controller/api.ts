import express from "express";
import { spaceManager } from "..";
import { Configration } from "../model/spaceInfo/configuration";

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
    const config: Configration = await spaceManager.getSpaceConfiguration(domainId);
    res.send(config);
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

router.put("/:id/configuration", async (req, res) => {
  try {
    const domainId: string = req.params.id;
    const newConfiguration = req.body.configuration;
    const clientSecret: string = req.body.clientSecret;
    await spaceManager.updateSpaceConfiguration(domainId, newConfiguration, clientSecret);
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

export { router };
