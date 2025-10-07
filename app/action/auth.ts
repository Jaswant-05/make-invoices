"use server"

import { User, userSigninSchema } from "../types/user";
import bcrypt from "bcryptjs";
import prisma from "../../utils/db";
import { generateCode } from "../../utils/generate_code";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../utils/resend";
import z from "zod";

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

        const url = `${process.env.BASE_URL}/verify/email?code=${code}`;

        const result = await sendVerificationEmail(newUser.email, newUser.name!, url)

        if(result.error) {
            console.error(result.error)
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

type resetPasswordProps = {
    password1 : string,
    password2 : string
    code : string
}

const passwordSchema = z.string()
    .min(8, 'The password must be at least 8 characters long')
    .max(32, 'The password must be a maximun 32 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%&*-)'
    )

export async function resetPassword(formData : resetPasswordProps){
    const isMatch = formData.password1 === formData.password2;
    if(!isMatch){
        return ({
            success : false,
            error  : "Both password should match"
        })
    }

    const {data, error} = passwordSchema.safeParse(formData.password1);
    if(error?.issues){
        const messages = error.issues.map((x) => x.message)
        return({
            errors: messages
        })
    }

    const hashedPassword = await bcrypt.hash(formData.password1, 10);
    try{
        const user = await prisma.user.findFirst({
            where : {
                passwordToken: formData.code
            }
        });

        if(!user){
            return({
                error : "Invalid URL/Code"
            })
        }

        if(user.passwordToken !== formData.code){
            return({
                error : "Invalid Code"
            })
        };

        const currentDate = new Date();
        if(user.tokenExpiry && user.tokenExpiry < currentDate){
            return({
                error : "Token Expired"
            })
        }

        console.log(hashedPassword);

        await prisma.user.update({
            where : {
                id : user.id
            },
            data : {
                passwordToken : null,
                tokenExpiry : null,
                password : hashedPassword
            }
        })

        return({
            success : true,
            message : "Password changed"
        });
    }
    catch(err: any){
        return({
            error : "Invalid Request"
        })
    }   
}

const emailSchema = z.email("Please enter a valid email");

export async function requestPasswordReset(formData?: FormData) {

    const rawEmail = formData?.get("email");
    const parsed = emailSchema.safeParse(String(rawEmail));
    
    if (!parsed.success) {
      return { error: "Invalid email" };
    }
    const email = parsed.data;
  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "If an account exists, a reset link has been sent." };
    }
  
    const token = generateCode({len : 6});
    const expires = new Date(Date.now() + 60 * 60 * 1000);
  
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordToken: token,
        tokenExpiry: expires,
      },
    });
  
    const url = `${process.env.BASE_URL}/verify/password?code=${token}`;
  
    const result = await sendPasswordResetEmail(user.email, user.name ?? "there", url);
    if ((result as any).error || (result as any).errror) {
      return { error: "Could not send reset email. Please try again later." };
    }
  
    return { message: "If an account exists, a reset link has been sent." };
  }