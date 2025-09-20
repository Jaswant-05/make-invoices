"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type State = "initial" | "loading" | "unauthenticated" | "ready"

export default function Invoices(){
    const session = useSession()
    const router = useRouter()
    const [state, setState] = useState<State>("initial");

    useEffect(() => {
        if(session.status == "loading"){
            setState("loading")
        }
        if(session.status == "unauthenticated"){
            setState("unauthenticated")
            router.push("/")
        }
        if(session.status == "authenticated"){
            setState("ready")
        }
    }, [session.status])


    if(state == "loading"){
        return(
            <div>loading...</div>
        )
    }

    if(state == "unauthenticated"){
        return(
            <div>Please Login</div>
        )
    }

    return (
        <div className="min-h-full bg-white flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-500 mb-4">Invoices</h1>
                    <div className="w-16 h-1 bg-gray-200 mx-auto mb-6"></div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-500">Coming Soon</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Stay tuned for exciting new features and customization options.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}