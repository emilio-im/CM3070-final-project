import getAllUserDocuments from "@lib/get-all-user-documents";

import { getHomeRedirection } from "@utils/index";
import { getSession } from "next-auth/react";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) return getHomeRedirection();

  const result = await getAllUserDocuments(
    (session.user as Record<string, string>)?.id
  );

  return { props: { documents: result } };
};

export { default } from "@views/Profile/user-profile";
