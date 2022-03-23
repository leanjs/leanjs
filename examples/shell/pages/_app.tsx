import { RuntimeProvider, createRuntime } from "@my-org/react-runtime";
import { Nav } from "../components/Nav";

const runtime = createRuntime();

export default function MyApp({ Component, pageProps }) {
  return (
    <RuntimeProvider runtime={runtime}>
      <Nav />
      <Component {...pageProps} />
    </RuntimeProvider>
  );
}
