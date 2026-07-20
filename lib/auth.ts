import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import connectDb from "./db";
import { error } from "console";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let email = credentials?.email;
        let password = credentials?.password;
        await connectDb();
        if (!email || !password) {
          throw new Error("email or password not found");
        }

        let existUser = await userModel.findOne({ email });
        if (!existUser) {
          throw new Error("user not found");
        }
        let isMatch = await bcrypt.compare(password, existUser.password);
        if (!isMatch) {
          throw new Error("password not match");
        }
        return {
          id: existUser._id,
          name: existUser.name,
          email: existUser.email,
          image: existUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ((token.id = user.id),
          (token.name = user.name),
          (token.email = user.email),
          (token.image = user.image));
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy:"jwt",
    maxAge:30*24*60*60*1000
  },
  pages: {
    signIn:"/login",
    error:"/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
