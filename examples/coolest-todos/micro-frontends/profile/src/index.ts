import { createApp } from "@leanjs/react-router";

import { ProfileApp } from "./components/ProfileApp";
import packageJson from "../package.json";

export default createApp(ProfileApp, {
  packageName: packageJson.name,
});
