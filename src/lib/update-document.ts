import { DATABASE_NAME, DOCUMENTS_COLLECTION } from "@constants/db";
import { ObjectId } from "mongodb";

import clientPromise from "@services/mongodb";

export type Document = {
  _id: string;
  blocks: unknown[];
};

const updateDocument = async (
  id: string,
  data: Record<string, unknown>
): Promise<Document> => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);

  const results = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data } }
  );

  return JSON.parse(JSON.stringify({ ...results }));
};

export default updateDocument;
