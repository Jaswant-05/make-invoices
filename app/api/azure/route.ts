import { Azure, TYPE } from "@/services/azure";
import { authOptions } from "@/utils/auth-option";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req : NextRequest) {
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
        blobName : "invoice1"
    }
    const result = await azure.createUrl(urlPayload)
    
    console.log(result);
    return NextResponse.json({
        url : result
    });
}