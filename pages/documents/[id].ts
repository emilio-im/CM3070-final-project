import canUserReadDocument from "@lib/guards/can-user-read";
import getSingleDocument from "@lib/get-document";

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

  const result = await getSingleDocument(id);
  const hasPermission = await canUserReadDocument({
    document: result,
    user: (session.user as Record<string, string>)?.id,
  });

  if (!hasPermission) return getHomeRedirection();

  return { props: { data: result } };
};

export { default } from "@views/Document/document";
