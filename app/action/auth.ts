"use server"

import { User, userSigninSchema } from "../types/user";
import bcrypt from "bcryptjs";
import prisma from "../utils/db";
import { generateCode } from "../utils/generate_code";
import axios from "axios";

export type AuthState = {
    message?: string,
    error?: string,
    token?: string,
    user?: User
}

export async function signup(initialState: AuthState, formData: FormData): Promise<AuthState> {
    const values = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        name: String(formData.get("name") ?? ""),
    };

    const parsed = userSigninSchema.safeParse(values);

    if (!parsed.success) {
        const messages = parsed.error.issues.map((issue) => issue.message);
        return { error: messages[0] };
    }

    const { email, password, name } = parsed.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const codePayload = {
            len : 6
        }
        const code = generateCode(codePayload);
        if(!code){
            return {
                message : "Failed to generate code"
            }
        }
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name, emailToken: code }
        });

        if (!newUser) {
            return { error: "Failed to create user" };
        }

        const url = `${process.env.BASE_URL}/verify/?token=${code}`;

        const emailProps : Record<string, any> = {
            name : newUser.name,
            url
        }

        const result = await axios.post('/api/send', {
            to: newUser.email,
            subject: "Make Invoices Email Verification Link",
            templateKey: "onboarding",
            props: emailProps,
          });

        if(result.data.error) {
            console.error(result.data.error)
            return { error: "Error sending email"};
        }

        return {
            message: "User created successfully"
        }

    }
    catch (error) {
        return { error: "Internal server error" };
    }
}