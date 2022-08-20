import { createApp } from "@leanjs/react-router";

import packageJson from "../package.json";
import { FeedApp } from "./components/FeedApp";

export default createApp(FeedApp, {
  packageName: packageJson.name,
});
