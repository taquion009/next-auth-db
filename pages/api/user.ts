import dbConnect from "@/lib/db/mongodb";
import User from "models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

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
        const { username, password } = req.body;

        if (!username || !password) {
          throw new Error("Username and password are required");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
          username,
          password: passwordHash,
        });

        const userSAve = await user.save();

        res.status(200).json({
          ok: true,
          message: "User created",
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
