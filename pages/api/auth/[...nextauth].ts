import User from "models/User";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "lib/db/mongodb";

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials: any) => {
        try {
          await dbConnect();

          const user = await User.findOne({ username: credentials.username });

          if (!user) {
            return null;
          }

          if (
            await bcrypt.compare(credentials.password, user._doc.passwordHash)
          ) {
            return {
              id: user._id,
              username: user.username,
              name: user.name,
            };
          }

          return null;
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }

      return token;
    },
    session: ({ session, token }: any) => {
      if (token) {
        session.id = token.id;
        session.username = token.username;
      }

      return session;
    },
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#fff",
    logo: "https://jwt.io/img/pic_logo.svg",
  },
});
