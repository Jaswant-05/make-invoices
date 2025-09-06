"use client"

import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { AuthState, login } from "../actions/auth"
import { useActionState } from "react"

const initialState : AuthState = {} 

export default function signin(){
    const [state, formAction, pending] = useActionState(login, initialState)

    return(
        <div className="min-w-full min-h-full flex justify-center items-center">
            <div className="flex flex-col gap-8 border border-gray-300 p-12 rounded-md">
                <h2 className="text-center font-bold text-2xl">Sign In</h2>
                <form className="flex flex-col gap-8" action={formAction}>
                    <Input name="email" placeholder="Email"/>
                    <Input name="password" placeholder="Password" type="password"/>
                    <Button disabled={pending} type="submit">
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    )
}