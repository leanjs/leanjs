import React, { useEffect } from "react";
import { HostProvider, createRuntime } from "@my-org/runtime-react";
import { Nav } from "../components/Nav";

const runtime = createRuntime({ context: { appName: "TodoShell" } });

export default function MyApp({ Component, pageProps }) {
  useEffect(() =>
    runtime.on("pusher", function pusherUsernameListener(pusher, state) {
      const channelName = "user-channel";
      const channel = pusher.subscribe(channelName);

      channel.bind("username-updated", function (data) {
        state.username = data;
      });

      return () => {
        pusher.unsubscribe(channelName);
      };
    })
  );

  return (
    <HostProvider origin="http://localhost:56600" runtime={runtime}>
      <Nav />
      <Component {...pageProps} />
    </HostProvider>
  );
}
