import clientPromise from "@services/mongodb";

import {
  DATABASE_NAME,
  DOCUMENTS_COLLECTION,
  WORKSPACES_COLLECTION,
} from "@constants/db";
import { ObjectID } from "bson";

import type { Document } from "./get-document";
import { getAllUserWorkspaces } from "./get-all-user-workspaces";

export type EnhancedDocument = Omit<Document, "workspace"> & {
  workspace: { id: string; name: string };
};

const getAllUserDocuments = async (id: string): Promise<EnhancedDocument[]> => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(DOCUMENTS_COLLECTION);

  const workspaces = await getAllUserWorkspaces(id);

  const workspacesIds = workspaces.map(
    (workspace) => new ObjectID(workspace._id.toString())
  );

  const res = await collection
    .find<Document>({
      $or: [{ createdBy: id }, { workspace: { $in: workspacesIds } }],
    })
    .toArray();

  /**
   * @description
   *  Map all documents and "enhance" workspace object assigning it the id and
   *  the workspace's name
   */
  const results = res.map((document) => ({
    ...document,
    workspace: {
      id: document.workspace,
      name:
        workspaces.find(
          (workspace) =>
            workspace._id.toString() === document.workspace.toString()
        )?.name || "Workspace",
    },
  }));

  return JSON.parse(JSON.stringify(results));
};

export default getAllUserDocuments;
