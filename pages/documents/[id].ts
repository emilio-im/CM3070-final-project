import getSingleDocument from "@lib/get-document";

import type { ParsedUrlQuery } from "querystring";
import type { GetServerSideProps } from "next";

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const result = await getSingleDocument(id);

  return { props: { data: result } };
};

export { default } from "@views/Document/document";
