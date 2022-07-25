import { DATABASE_NAME, DOCUMENTS_COLLECTION } from "@constants/db";
import clientPromise from "@services/mongodb";

const createDocument = async () => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);
  const res = await collection.insertOne({ blocks: [] });

  return res.insertedId;
};

export default createDocument;
