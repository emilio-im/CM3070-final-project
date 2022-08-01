import clientPromise from "@services/mongodb";

import {
  DATABASE_NAME,
  DOCUMENTS_COLLECTION,
  WORKSPACES_COLLECTION,
} from "@constants/db";

import type { Document } from "./get-document";
import { ObjectID } from "bson";

const getAllUserDocuments = async (id: string): Promise<Document[]> => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);

  const workspaces = await client
    .db(DATABASE_NAME)
    .collection(WORKSPACES_COLLECTION)
    .find<{ _id: ObjectID; members: string[] }>({
      $where: function () {
        return this.members.includes(id);
      },
    })
    .toArray();

  const workspacesIds = workspaces.map(
    (workspace) => new ObjectID(workspace._id.toString())
  );

  const results = await collection
    .find<Document>({
      $or: [{ createdBy: id }, { workspace: { $in: workspacesIds } }],
    })
    .toArray();

  return JSON.parse(JSON.stringify(results));
};

export default getAllUserDocuments;
