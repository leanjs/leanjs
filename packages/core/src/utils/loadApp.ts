import { createAppError, getMount, isPromise } from ".";
import {
  GetComposableApp,
  GetComposableAppAsync,
  LoadApp,
  RemoteComposableApp,
} from "../types";

export function isRemoteApp(
  app: GetComposableApp | GetComposableAppAsync
): app is RemoteComposableApp {
  return typeof app === "object" && !!(app as RemoteComposableApp).packageName;
}

export const loadApp: LoadApp = ({
  app,
  remote,
  version,
  context,
  HostWrapper,
}) => {
  return new Promise((resolve, reject) => {
    function handleError(error: Error, appName = "") {
      reject(createAppError({ error, appName, version }));
    }

    async function run() {
      const appName = isRemoteApp(app) ? app.packageName : app.appName;

      try {
        const maybeAsyncApp =
          typeof app === "function" ? app({ isSelfHosted: false }) : app;

        const syncApp = isPromise(maybeAsyncApp)
          ? (await maybeAsyncApp).default
          : maybeAsyncApp;

        const { mount, url, name } = await getMount({
          app: syncApp,
          remote,
          context,
        });

        if (!mount) {
          handleError(
            new Error(`mount is undefined ${url ? ", URL: " + url : ""}`),
            name
          );
        } else {
          resolve({
            default: () => HostWrapper(mount, url),
          });
        }
      } catch (error: any) {
        handleError(error, appName);
      }

      return undefined;
    }

    run();
  });
};
