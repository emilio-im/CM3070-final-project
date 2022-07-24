import { DATABASE_NAME, DOCUMENTS_COLLECTION } from "@constants/db";
import clientPromise from "@services/mongodb";
import { apiRequest } from "@utils/requests";

import type { NextApiRequest, NextApiResponse } from "next";

const getDocument = async (id: string) => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);
  const results = await collection.findOne({ id });

  return results || {};
};

const handler = apiRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const result = await getDocument(req.query.id as string);
      return res.status(200).json({ ...result });
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
);

export default handler;
