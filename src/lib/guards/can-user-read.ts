import clientPromise from "@services/mongodb";

import { DATABASE_NAME, WORKSPACES_COLLECTION } from "@constants/db";

type Workspace = Record<string, string> & {
  members: string[];
};

type Document = {
  _id: string;
  blocks: unknown[];
  createdBy: string;
  workspace: string;
};

type Props = {
  /** User ID */
  user: string;
  /** Document to check */
  document: Document;
};

/**
 * Determines if a certain user can read a specific document.
 *
 * @description
 *  This function receives a user id and the already structured document (using
 *  Database's schema - it is also typed so we can get only the fields we'll use
 *  in case the schema changes). This function gets all the workspaces where the
 *  user is member and checks:
 *    1. if any of these workspaces is the document's workspace
 *    2. there's no workspace and the user has created the document (this is the
 *       case where it is within the personal workspace).
 * @param { user: string, document: Document } param: user id and document to check
 * @returns { Promise<boolean> }
 *  true if user can read the document or false if not
 */
const canUserReadDocument = async ({
  user,
  document,
}: Props): Promise<boolean> => {
  const client = await clientPromise;
  const collection = client.db(DATABASE_NAME).collection(WORKSPACES_COLLECTION);
  const workspaces = await collection
    .find<Workspace>({
      $where: function () {
        return this.members.includes(user);
      },
    })
    .toArray();

  if (!workspaces?.length) return false;

  return (
    workspaces.some((workspace) => workspace.members.includes(user)) ||
    (!document.workspace && document.createdBy === user)
  );
};

export default canUserReadDocument;
