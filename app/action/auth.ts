"use server"

import { User, userSigninSchema } from "../types/user";
import bcrypt from "bcryptjs";
import prisma from "../utils/db";

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

        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });

        if (!newUser) {
            return { error: "Failed to create user" };
        }

        return {
            message: "User created successfully"
        }

    }
    catch (error) {
        return { error: "Internal server error" };
    }
}