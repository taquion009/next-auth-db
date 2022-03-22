import dbConnect from "lib/db/mongodb";
import Otro from "models/Otro";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  ok: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        await new Otro(req.body).save();

        res.status(200).json({
          ok: true,
          message: "Otro created",
        });
      } catch (err: any) {
        res.status(500).json({
          message: err.message,
          ok: false,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
