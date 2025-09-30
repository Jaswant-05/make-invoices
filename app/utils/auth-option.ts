import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import prisma from "./db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.username || !credentials.password) {
          throw new Error("Missing Credentials");
        }

        console.log("=== LOGIN ATTEMPT ===");
        console.log("Email:", credentials.username);
        console.log("Password length:", credentials.password.length);
        
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.username
          }
        });
        

        console.log("User found:", !!user);
        console.log("User has password:", !!user?.password);

        if (!user || !user.password) {
          return null;
        }

        console.log("Stored hash:", user.password);
        console.log("Hash starts with $2:", user.password.startsWith('$2'));

        if(!user.emailVerified){
          throw new Error("Please Verify your email first")
        }

        console.log("About to compare passwords...");
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        console.log("Password match result:", isMatch);
        console.log(isMatch)
        if (!isMatch) {
          throw new Error("Invalid username or password");
        }
        
        return { id: user.id, email: user.email };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signup",
  }
};