import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, Session, User } from "next-auth";
import prisma from "./db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { JWT } from "next-auth/jwt";

dotenv.config()

export const auth_option : AuthOptions = {
    adapter: PrismaAdapter(prisma),     
    providers: [
        Google({
            clientId : process.env.GOOGLE_CLIENT_ID || "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || "" 
        }),
        Credentials({
            name: "Email",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){

                if(!credentials?.username || !credentials.password){
                    throw new Error("Missing Credentials");
                }

                const user = await prisma.user.findFirst({
                    where : {
                        email : credentials.username
                    }
                });

                if(!user || !user.password){
                    return null
                }
                
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if(!isMatch){
                    throw new Error("Invalid username or password");
                }

                return {id : user.id, email: user.email}
            }
        }),
        
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user } : { token : JWT, user: User }) {
            if (user) {
                token.id = token.sub!;
              }
              return token;
        },
        async session({ session, token } : { session: Session, token: JWT}) {
            session.user.id = token.id as string;
            return session
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    }
}