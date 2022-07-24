import { DATABASE_NAME, DOCUMENTS_COLLECTION } from "@constants/db";
import clientPromise from "@services/mongodb";

import type { NextApiRequest, NextApiResponse } from "next";

const getDocument = async (id: string) => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);
  return await collection.findOne({ id });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    console.log(req.query);
    // const result = await getDocument(req)
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
