import { _ as CoreUtils } from "@leanjs/core";
import axios from "axios";
import { createProxyServer } from "http-proxy";
import cors from "cors";
import createServer, { json } from "express";
import { basename } from "path";
import detect from "detect-port";
import { Sema } from "async-sema";
import chalk from "chalk";
import type { Server } from "http";

import findLeanConfigSync from "./findLeanConfigSync";

const { createRemoteName } = CoreUtils;
const hashtable = new Map();
const remotePortSema = new Sema(1);
const defaultDevServerPort = 26560;

let latestUsedPort: number;

export function startDevProxyServer(): Promise<{
  api: {
    updatePackagePort: (packageName: string, port: number) => void;
    generatePackagePort: (packageName: string) => Promise<number>;
  };
}> {
  let devServer: Server | undefined;
  const config = findLeanConfigSync();
  const configDevServerPort = config?.devServer?.port;
  if (!configDevServerPort) {
    console.warn(
      `No devServer port found in lean.config.js. Using default value ${defaultDevServerPort}`
    );
  }
  const devServerPort = configDevServerPort ?? defaultDevServerPort;
  const DEV_SERVER_ORIGIN = `http://localhost:${devServerPort}`;
  const REMOTE_PORT_ENDPOINT = `${DEV_SERVER_ORIGIN}/remote/port`;
  const api = {
    updatePackagePort: (packageName: string, port: number) =>
      axios.post(REMOTE_PORT_ENDPOINT, { packageName, port }),
    generatePackagePort: async (packageName: string) => {
      await remotePortSema.acquire();
      try {
        latestUsedPort = await detect(latestUsedPort);
      } finally {
        remotePortSema.release();
      }
      await axios.post(REMOTE_PORT_ENDPOINT, {
        packageName,
        port: latestUsedPort,
      });

      return latestUsedPort;
    },
  };

  if (latestUsedPort) {
    return Promise.resolve({ api, devServer });
  }
  latestUsedPort = devServerPort;

  return new Promise((resolve, reject) => {
    const resolveApi = () => {
      console.log(
        `🚀 Lean dev server running at ${chalk.cyan(
          `http://localhost:${devServerPort}`
        )}`
      );
      resolve({ api });
    };
    const proxyServer = createProxyServer({ ignorePath: true });
    devServer = createServer()
      .use(cors())
      .use(json())
      .post("/remote/port", async (req, res) => {
        const { packageName, port } = req.body;
        const formattedName = createRemoteName(packageName);
        const origin = `http://localhost:${port}`;
        const data = {
          origin,
          packageName,
        };
        hashtable.set(formattedName, data);
        console.log(`Hashtable updated with ${formattedName}:`, data);
        res.json(port);
      })
      .all("/:remoteName/*", (req, res) => {
        const { remoteName } = req.params;
        const data = hashtable.get(remoteName);
        if (!data) {
          res.send(404);
        } else {
          const fileName = basename((req.params as any)[0]);
          if (data.origin && fileName) {
            proxyServer.web(req, res, {
              target: `${data.origin}/${fileName}`,
            });
          } else {
            res.send(404);
          }
        }
      })
      .get("/status", (_, res) => {
        res.json({
          leanjs: "ok",
        });
      })
      .get("/", (_, res) => {
        res.json(
          [...hashtable.values()].reduce((acc, { origin, packageName }) => {
            acc[packageName] = origin;

            return acc;
          }, {})
        );
      })
      .listen(devServerPort, resolveApi);

    devServer.on("error", async (error: Error) => {
      if (error.message.includes("EADDRINUSE")) {
        let ok = false;
        try {
          // checking if the address is already in use by Lean Dev Server
          const { data } = await axios.get(`${DEV_SERVER_ORIGIN}/status`);
          ok = data.leanjs === "ok";
        } catch (error) {
          // GET /status failed, therefore Lean Dev Server is not running on that address
        }

        if (ok) {
          resolveApi();
        } else {
          reject(
            `🚨 port ${chalk.cyan(
              devServerPort
            )} is in use. Update devServer port in lean.config.js`
          );
        }
      } else {
        reject(error);
      }
    });
  });
}
