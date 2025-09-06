import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    email: z.email(),
    password: z
       .string()
       .min(8, 'The password must be at least 8 characters long')
       .max(32, 'The password must be a maximun 32 characters')
       .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const userLoginSchema = userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

export const userSigninSchema = userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

export const userUpdateSchema = userSchema.omit({
    id: true
})

export type User = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserSignin = z.infer<typeof userSigninSchema>;
export type UserUpdate = Partial<z.infer<typeof userUpdateSchema>>;