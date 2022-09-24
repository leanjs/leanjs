import { createApp } from "@leanjs/react/18";

import packageJson from "../package.json";
import ZimaBlue from "./App";

// export default ZimaBlue;
export default createApp(ZimaBlue, {
  packageName: packageJson.name,
});
