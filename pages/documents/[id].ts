import canUserReadDocument from "@lib/guards/can-user-read";
import getSingleDocument from "@lib/get-document";

import { getAllUserWorkspaces } from "@lib/get-all-user-workspaces";
import { getHomeRedirection } from "@utils/index";
import { getSession } from "next-auth/react";
import { isIdValid } from "@utils/id";

import type { ParsedUrlQuery } from "querystring";
import type { GetServerSideProps } from "next";

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const session = await getSession({ req: context.req });

  if (!session || !isIdValid(id)) return getHomeRedirection();

  const userId = (session.user as Record<string, string>)?.id;

  const result = await getSingleDocument(id);
  const hasPermission = await canUserReadDocument({
    document: result,
    user: userId,
  });

  if (!hasPermission) return getHomeRedirection();

  const userWorkspaces = await getAllUserWorkspaces(userId);

  return {
    props: {
      data: result,
      workspaces: JSON.parse(JSON.stringify(userWorkspaces)),
    },
  };
};

export { default } from "@views/Document/document";
