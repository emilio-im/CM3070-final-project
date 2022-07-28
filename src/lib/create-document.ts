import clientPromise from "@services/mongodb";

import {
  DATABASE_NAME,
  DOCUMENTS_COLLECTION,
  WORKSPACES_COLLECTION,
} from "@constants/db";

const createDocument = async (userId: string) => {
  const client = await clientPromise;

  const workspace = await client
    .db(DATABASE_NAME)
    .collection(WORKSPACES_COLLECTION)
    .findOne({
      $where: function () {
        return this.members.includes(userId);
      },
    });

  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);
  const res = await collection.insertOne({
    blocks: [],
    workspace: workspace?._id || null,
  });

  return res.insertedId;
};

export default createDocument;
