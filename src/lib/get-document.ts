import clientPromise from "@services/mongodb";

import { DATABASE_NAME, DOCUMENTS_COLLECTION } from "@constants/db";
import { ObjectId } from "mongodb";

export type Document = {
  _id: string;
  blocks: unknown[];
  createdBy: string;
  workspace: string;
  updatedAt?: Date | string;
};

const getSingleDocument = async (id: string): Promise<Document> => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);
  const results = await collection.findOne({ _id: new ObjectId(id) });

  return JSON.parse(JSON.stringify({ ...results }));
};

export default getSingleDocument;
