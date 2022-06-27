import Layout from "@layout/main-layout";
import Page from "@views/Editor";
import Head from "next/head";

const MainPage = () => (
  <Layout>
    <Head>
      <title>CM3070 - Final Project</title>
    </Head>

    <Page />
  </Layout>
);

export default MainPage;
