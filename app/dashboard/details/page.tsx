"use client"

import { getUserSchema, User } from "@/app/types/user"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import z from "zod"

type State = "initial" | "loading" | "unauthenticated" | "ready"

//Todo : Add Toast to show success and or fail

export default function UserProfileForm() {
    const session = useSession()
    const router = useRouter()
    const [state, setState] = useState<State>("initial");
    const [user, setUser] = useState<User>({
        name: "",
        email: "",
        number: "",
        address: ""
    });
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(session.status === "loading"){
            setState("loading")
        }
        if(session.status === "unauthenticated"){
            setState("unauthenticated")
            router.push("/")
        }
        if(session.status === "authenticated"){
            setState("ready")
        }
    }, [session.status, router])

    const form = useForm<z.infer<typeof getUserSchema>>({
        resolver: zodResolver(getUserSchema),
        defaultValues: {
          name: "",
          email: "",
          number: "",
          address: ""
        },
    })

    useEffect(() => {
        const fetchUserData = async () => {
            if (session.status !== "authenticated" || isDataLoaded) return;
            
            try {
                const res = await axios.get("/api/user");
                const data = res.data.data;
                
                setUser(data);
                form.setValue("name", data.name || "");
                form.setValue("email", data.email || "");
                form.setValue("number", data.number || "");
                form.setValue("address", data.address || "");
                setIsDataLoaded(true);
            } catch(err: any) {
                console.error(err.message);
                alert("Failed to fetch user data");
            }
        };

        fetchUserData();
    }, [session.status, isDataLoaded, form]);

    async function onSubmit(values: z.infer<typeof getUserSchema>) {
        setIsSubmitting(true);
        try {
            await axios.put("/api/user", values);
            console.log("Profile updated:", values);

        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if(state === "loading" || !isDataLoaded){
        return(
            <div className="min-h-screen flex justify-center items-center">
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    if(state === "unauthenticated"){
        return(
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Please login to continue</p>
                    <Button onClick={() => router.push("/")} variant="outline">
                        Go to Login
                    </Button>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-full bg-gray-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
                    <p className="text-gray-600 mt-2">Update your information</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your name" 
                                            className="h-11"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500">
                                        Your public display name
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your phone number" 
                                            type="tel"
                                            className="h-11"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500">
                                        Your contact number
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Address</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Enter your address" 
                                            className="resize-none"
                                            rows={3}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500">
                                        Your mailing address
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button 
                            type="submit" 
                            className="w-full h-11"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}