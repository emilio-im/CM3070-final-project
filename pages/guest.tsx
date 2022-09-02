import Page from "@views/Editor";

import { getHomeRedirection } from "@utils/index";
import { getSession } from "next-auth/react";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) return getHomeRedirection();

  return { props: {} };
};

export default Page;
