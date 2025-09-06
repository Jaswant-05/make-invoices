"use server"

import { z } from "zod";
import { User, userLoginSchema, userSigninSchema } from "../types/user";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import prisma from "../utils/db";
import jwt from "jsonwebtoken";

dotenv.config();

export type AuthState = {
    message? : string,
    error? : string,
    token? : string,
    user? : User
}

export async function login(initialState: AuthState, formData : FormData) : Promise<AuthState> {
    const email =  formData.get("email")
    const password = formData.get("password")

    const { data, error } = z.safeParse(userLoginSchema, { email, password });

    if (error){
        return { error: error.message};
    }

    try{
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user){
            return { error: "User not found"};
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid){
            return { error: "Invalid password"};
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        
        return { token, user };

    }
    catch(error){
        return { error: "Internal server error"};
    }
}

export async function signup(initialState: AuthState, formData : FormData) : Promise<AuthState> {
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = z.safeParse(userSigninSchema, { email, password });

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
            data: { email: data.email, password: hashedPassword }
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