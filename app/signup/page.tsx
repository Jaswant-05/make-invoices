"use client"

import { Input } from "@/components/Input";
import { AuthState, signup } from "../action/auth";
import { Button } from "@/components/Button";
import { useActionState, useCallback, useState } from "react";
import { PlaceAutoComplete } from "@/components/PlaceAutoComplete";

const initialState : AuthState = {}

export default function Page(){
    const [state, formAction, pending] = useActionState(signup, initialState)
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

    const handlePlaceSelect = useCallback(
        (place: google.maps.places.PlaceResult | null) => {
          if(!place?.formatted_address){
            return
          }
          setSelectedPlace(place?.formatted_address);
        },
    []);

    return (
        <div className="min-w-full h-full flex justify-center items-center ">
            <div className="flex flex-col gap-8 border border-gray-300 rounded-md p-12">
                <h2 className="text-center font-bold text-2xl">Sign Up</h2>

                <form action={formAction} className="flex flex-col gap-8">
                    <Input
                        className="" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <Input
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        required
                    />

                    <PlaceAutoComplete 
                        onPlaceSelect={handlePlaceSelect} 
                        name="address"
                    />
                    {state.error && <div className="">{state.error}</div>}
                    <Button 
                        className="" 
                        type="submit" 
                        disabled={pending}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}