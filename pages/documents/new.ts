import createDocument from "@lib/create-document";

import { getSession } from "next-auth/react";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session) return { redirect: { permanent: false, destination: "/" } };

  const document = await createDocument(
    (session.user as Record<string, string>)?.id
  );

  return {
    redirect: {
      permanent: false,
      destination: `/documents/${document}`,
    },
  };
};

export { default } from "@lib/empty-page";
