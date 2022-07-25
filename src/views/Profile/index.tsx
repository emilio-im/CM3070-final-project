import { getSession } from "next-auth/react";

import type { GetServerSideProps } from "next";

const Page = () => <div />;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    redirect: {
      permanent: false,
      destination: session ? `/${session.username}` : "/",
    },
  };
};

export default Page;
