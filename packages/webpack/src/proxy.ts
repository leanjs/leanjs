import { _ as CoreUtils } from "@leanjs/core";
import axios from "axios";
import { createProxyServer } from "http-proxy";
import cors from "cors";
import createServer, { json } from "express";
import { basename } from "path";

const hashtable = new Map();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(`${process.cwd()}/package.json`);

const { defaultProxyPort, createRemoteName } = CoreUtils;
interface SaveMicroAppPortArgs {
  devServerPort?: number;
  microAppPort: number;
}
export function saveMicroAppPort({
  devServerPort = defaultProxyPort,
  microAppPort,
}: SaveMicroAppPortArgs) {
  const proxyServer = createProxyServer({ ignorePath: true });
  createServer()
    .use(cors())
    .use(json())
    .post("/remote/:name", (req) => {
      const { name } = req.params;
      const { origin } = req.body;
      hashtable.set(name, origin);
      console.log(`Hashtable updated with ${name}:${origin}`);
    })
    .get("/remotes", (_, res) => {
      res.json(Object.fromEntries(hashtable));
    })
    .all("/proxy/:remoteName/*", (req, res) => {
      const { remoteName } = req.params;
      const origin = hashtable.get(remoteName);
      const fileName = basename((req.params as any)[0]);
      if (origin && fileName) {
        proxyServer.web(req, res, {
          target: `${origin}/${fileName}`,
        });
      } else {
        res.send(404);
      }
    })
    .listen(devServerPort, () => {
      console.log(`🚀 Lean micro-frontends listening on port ${devServerPort}`);
      save();
    })
    .on("error", (error: Error) => {
      // TODO check that the address is taken by another instance of the plugin
      if (error.message.includes("EADDRINUSE")) {
        save();
      } else {
        console.error(error);
      }
    });

  function save() {
    axios
      .post(
        `http://localhost:${devServerPort}/remote/${createRemoteName(
          packageJson.name
        )}`,
        {
          origin: `http://localhost:${microAppPort}`,
        }
      )
      .catch(console.error);
  }
}
