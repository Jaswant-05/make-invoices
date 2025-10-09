import { Azure, TYPE } from "@/services/azure";
import { authOptions } from "@/utils/auth-option";
import prisma from "@/utils/db";
import { useFavicon } from "@mantine/hooks";
import { includes } from "lodash";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    const { data } = await req.json();
    const session = await getServerSession(authOptions);
    if(!session || !session?.user){
        return NextResponse.json({
            error : "Unauthorized"
        },{status : 401})
    }

    const userId = session.user.id;
    const url = "https://bucket1.blob.core.windows.net/invoices"

    const azure = new Azure(url);
    const urlPayload = {
        type : TYPE.WRITE,
        blobName : data.blobName
    }
    console.log(data.blobName)
    console.log(urlPayload)
    const result = await azure.createUrl(urlPayload)
    
    return NextResponse.json({
        url : result,
        blobName :data.blobName
    });
}

export async function GET(req : NextRequest){
    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const invoiceId = searchParams.get("invoiceId")
    
    if(!session || !session.user?.id){
        return NextResponse.json({
            message : "Unauthorized"
        }, { status :  401 });
    }

    if(!invoiceId){
        return NextResponse.json({
            message : "Bad Request"
        }, { status :  500 });
    }

    const data = await prisma.invoice.findUnique({
        where : {
            id : invoiceId
        },
        select : {
            blobName : true
        }
    });

    const blobName = data?.blobName;
    if(!blobName){
        return NextResponse.json({
            message : "Bad request"
        },{status : 500})
    }

    const userId = session.user.id;
    const url = "https://bucket1.blob.core.windows.net/invoices"

    const azure = new Azure(url);
    const urlPayload = {
        type : TYPE.WRITE,
        blobName
    }
    console.log(blobName)
    console.log(urlPayload)
    const result = await azure.createUrl(urlPayload)
    
    return NextResponse.json({
        url : result,
        blobName : blobName
    });
}