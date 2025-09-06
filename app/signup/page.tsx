"use client"

import { Input } from "@/components/Input";
import { AuthState, signup } from "../actions/auth";
import { Button } from "@/components/Button";
import { useActionState } from "react";

const initialState : AuthState = {}

export default function Page(){
    const [state, formAction, pending] = useActionState(signup, initialState)
    return (
        <div className="min-w-full h-full flex justify-center items-center ">
            <div className="flex flex-col gap-8 border border-gray-300 rounded-md p-12">
                <h2 className="text-center font-bold text-2xl">Sign Up</h2>
                <form action={formAction} className="flex flex-col gap-8">
                    <Input className="" type="email" name="email" placeholder="Email" required autoComplete="email"/>
                    <Input type="password" name="password" placeholder="Password" required autoComplete="new-password"/>
                    {state.error && <div className="">{state.error}</div>}
                    <Button className="" type="submit" disabled={pending}>Submit</Button>
                </form>
            </div>
        </div>
    )
}