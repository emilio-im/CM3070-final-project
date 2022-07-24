import type { NextApiRequest, NextApiResponse } from "next";

export const apiRequest = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    try {
      await handler(req, res);
    } catch (error: any) {
      const { statusCode = 500 } = error.response ? error.response : error;
      res.status(statusCode).json({ message: error.message, error: true });
    }
  };
};
