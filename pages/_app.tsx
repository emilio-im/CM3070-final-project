import Head from "next/head";

import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";
import "../styles/tailwind.css";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <Head>
      <title>CM3070 - Final Project</title>
    </Head>

    <Component {...pageProps} />
  </SessionProvider>
);

export default App;
