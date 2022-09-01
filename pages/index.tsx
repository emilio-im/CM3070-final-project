import getAllUserDocuments from "@lib/get-all-user-documents";
import HomePage from "@views/Home";

import { getSession } from "next-auth/react";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/guest",
      },
    };
  }

  const result = await getAllUserDocuments(
    (session.user as Record<string, string>)?.id
  );

  const sorted = result
    .filter((document) => !!document.updatedAt)
    .sort(
      (a, b) =>
        (typeof b?.updatedAt === "string"
          ? new Date(b?.updatedAt)
          : undefined || new Date()
        )?.getTime() -
        (typeof a?.updatedAt === "string"
          ? new Date(a?.updatedAt)
          : a.updatedAt || new Date()
        )?.getTime()
    );

  return { props: { documents: sorted.slice(0, 5) } };
};

export default HomePage;
