import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    const data = await req.json();

    try{
        const user = await prisma.user.findUnique({
            where : { 
                emailToken : data.code
            }
        });

        if(!user){
            return NextResponse.json(
                { error: "Invalid Code" },
                { status: 404 }
            );
        }

        if(user.emailVerified){
            return NextResponse.json(
                { message: "Email verified" },
                { status: 200 }
            );
        }

        const token = user.emailToken
        if(!token){
            return NextResponse.json(
                { error: "Invalid Request" },
                { status: 400 }
            );
        }

        if(token != data.code){
            throw new Error("Bad Request");
        }
        
        await prisma.user.update({
            where : {
                id : user.id
            },
            data : {
                emailToken : null,
                emailVerified : new Date()
            }
        })

        return NextResponse.json({
            success : true,
            message : "Email verified successfully"
        })
    }
    catch(err: any){
        console.error(err.message);
        return NextResponse.json({
            message : "Bad Request"
        },{status : 500})
    }
}   