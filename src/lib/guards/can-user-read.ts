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
    document.createdBy === user
  );
};

export default canUserReadDocument;
