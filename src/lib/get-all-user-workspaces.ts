import clientPromise from "@services/mongodb";

import { DATABASE_NAME, WORKSPACES_COLLECTION } from "@constants/db";

import type { ObjectID } from "bson";

export type Workspace = {
  _id: ObjectID | string;
  members: string[];
  name: string;
};

export const getAllUserWorkspaces = async (
  userId: string
): Promise<Workspace[]> => {
  const client = await clientPromise;

  const result = await client
    .db(DATABASE_NAME)
    .collection(WORKSPACES_COLLECTION)
    .find<Workspace>({
      $where: function () {
        return this.members.includes(userId);
      },
    })
    .toArray();

  // @TODO: remove this filter when $where function handles 100% of the cases
  // @see https://linuxhint.com/where-operator-mongodb/
  return result.filter((workspace) => workspace.members.includes(userId));
};
