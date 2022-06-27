import Head from "next/head";

import "../styles/globals.css";
import "../styles/tailwind.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CM3070 - Final Project</title>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
