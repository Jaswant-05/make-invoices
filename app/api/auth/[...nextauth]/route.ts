import NextAuth from "next-auth";
import { auth_option } from "@/app/utils/auth-option";

const handler = NextAuth(auth_option);
export { handler as GET, handler as POST };