import { defaultProxyPort } from "@leanjs/core";
import axios from "axios";
import { createProxyServer } from "http-proxy";
import cors from "cors";
import createServer, { json } from "express";

const hashtable = new Map();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(`${process.cwd()}/package.json`);

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
    .post("/micro/:packageName", (req) => {
      const packageName = decodeURIComponent(req.params.packageName);
      const { origin } = req.body;
      hashtable.set(packageName, origin);
      console.log(`Hashtable updated with ${packageName}:${origin}`);
    })
    .get("/micro/:packageName", (req, res) => {
      const { packageName } = req.params;
      const origin = hashtable.get(decodeURIComponent(packageName));
      if (origin) {
        res.json({ origin, packageName }).status(origin ? 200 : 404);
      } else {
        res.send(404);
      }
    })
    .all("/proxy/:packageName/*", (req, res) => {
      const origin = hashtable.get(decodeURIComponent(req.params.packageName));
      const path = (req.params as any)[0];
      proxyServer.web(req, res, {
        target: `${origin}/${path}`,
      });
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
        `http://localhost:${devServerPort}/micro/${encodeURIComponent(
          packageJson.name
        )}`,
        {
          origin: `http://localhost:${microAppPort}`,
        }
      )
      .catch(console.error);
  }
}
