import { HostProvider, createRuntime } from "@my-org/runtime-react";
import { Nav } from "../components/Nav";

const runtime = createRuntime();

runtime.on("pusher", function pusherUsernameListener(pusher, state) {
  const channelName = "user-channel";
  const channel = pusher.subscribe(channelName);

  channel.bind("username-updated", function (data) {
    state.username = data;
  });

  return () => {
    pusher.unsubscribe(channelName);
  };
});

export default function MyApp({ Component, pageProps }) {
  return (
    <HostProvider runtime={runtime}>
      <Nav />
      <Component {...pageProps} />
    </HostProvider>
  );
}
