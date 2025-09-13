"use server"

import { z } from "zod";
import { User, userSigninSchema } from "../types/user";
import bcrypt from "bcryptjs";
import prisma from "../utils/db";

export type AuthState = {
    message? : string,
    error? : string,
    token? : string,
    user? : User
}

export async function signup(initialState: AuthState, formData : FormData) : Promise<AuthState> {
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name")

    const { data, error } = z.safeParse(userSigninSchema, { email, password, name });
    if ( error ){
        return { error: error.message};
    }

    try{
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if ( user ){
            return { error: "User already exists"};
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: { email: data.email, password: hashedPassword, name: data.name }
        });

        if(!newUser){
            return { error: "Failed to create user"};
        }

        return { 
            message : "User created successfully"
        }

    }
    catch(error){
        return { error: "Internal server error"};
    }
}