import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: NextApiRequest) {
  const session = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session)
    return NextResponse.json({ status: "error", message: "No session" });

  return NextResponse.next();
}
