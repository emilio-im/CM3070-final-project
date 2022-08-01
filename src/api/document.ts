import getSingleDocument from "@lib/get-document";
import updateDocument from "@lib/update-document";

import { apiRequest } from "@utils/requests";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = apiRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const result = await getSingleDocument(req.query.id as string);
      return res.status(200).json({ ...result });
    }

    if (req.method === "PUT") {
      const result = await updateDocument(req.query.id as string, req.body);
      return res.status(200).json({ ...result });
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
);

export default handler;
