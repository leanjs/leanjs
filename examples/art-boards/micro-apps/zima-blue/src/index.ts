//import * as A from "@leanjs/react/aa";
import { createApp } from "@leanjs/react/18";

import ZimaBlue from "./App";

import React from "react";
console.log("aaaaaa", React.version);

// export default ZimaBlue;
export default createApp(ZimaBlue, {
  packageName: "@art-boards/ad",
});
