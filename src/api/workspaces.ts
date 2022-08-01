import clientPromise from "@services/mongodb";

import { DATABASE_NAME, WORKSPACES_COLLECTION } from "@constants/db";
import { apiRequest } from "@utils/requests";
import { getSession } from "next-auth/react";

import type { NextApiRequest, NextApiResponse } from "next";

const createWorkspace = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session) throw new Error("Unauthorized");

  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(WORKSPACES_COLLECTION);
  const results = await collection.insertOne({
    ...req.body,
    members: [(session.user as Record<string, string>)?.id],
  });

  return results || {};
};

const handler = apiRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const result = await createWorkspace(req);
      return res.status(200).json({ ...result });
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
);

export default handler;
