import { userUpdateSchema } from "@/app/types/user";
import { authOptions } from "@/app/utils/auth-option";
import prisma from "@/app/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json(
            { error: "User ID not found" },
            { status: 401 }
        );
    }
    const userId = session.user.id; 

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: user }, { status: 200 });
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest){
    const body = await req.json()
    const { data, error } = userUpdateSchema.safeParse(body)

    if(!data || error){
        return NextResponse.json({
            error : error.message || "Invalid Input"
        }, {status : 403})
    }

    const session = await getServerSession(authOptions)
    if(!session){
        return NextResponse.json(
            { error: "User ID not found" },
            { status: 401 }
        );
    }

    try{
        const result = await prisma.user.update({
            where : {
                id : session.user.id
            },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                address : true,
                number : true
              },
        });

        if(!result){
            return NextResponse.json({
                error : "Error updating user"
            }, {status : 400})
        }



        return NextResponse.json({
            data : result
        }, {status: 200})

    } catch(err: any){
        return NextResponse.json({
            error : err.message
        }, {status : 500})
    }
}