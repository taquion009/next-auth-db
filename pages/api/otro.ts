import dbConnect from "@/lib/db/mongodb";
import Otro from "models/Otro";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

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

  const user = await getSession({ req });
  const token = await getToken({ req });

  console.log(token, "tohen");

  if (!user) {
    res.status(401).json({
      ok: false,
      message: "Unauthorized",
    });
  }

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
