"use server"
import { invoiceFormSchema, InvoiceFormSchema } from "../types/invoice";
import { getServerSession } from "next-auth";
import prisma from "../../utils/db";
import { authOptions } from "../../utils/auth-option";

export async function createInvoice(formData : InvoiceFormSchema, blobName : string){
    const { data, error } = invoiceFormSchema.safeParse(formData);
    if(error){
        return({
            success : false,
            error : error.message
        })
    }

    const session = await getServerSession(authOptions)
    if(!session){
        return({
            success : false,
            error : "Unauthorized"
        })
    }

    const userId = session.user.id

    try{
        const invoiceTotal = data.invoiceItems.reduce(
            (acc, curr) => acc + (curr.quantity ?? 1) * curr.amount,
            0
        );

        const tax = data.tax ? parseInt(data.tax as any) : 0;
        const total_with_tax = invoiceTotal + (invoiceTotal * (tax/100))

          
        const { invoiceItems, ...payload } = {
          ...data,
          total: invoiceTotal,
          total_with_tax,
          blobName,
          userId    
        };

        const invoice = await prisma.invoice.create({
          data: {
            ...payload,
            invoiceItems: {
              create: invoiceItems.map((item) => ({
                name: item.name,
                quantity: item.quantity ?? 1,
                amount: item.amount,
              })),
            },
          },
          include: { invoiceItems: true }, 
        });

        return({
          success : true,
          data : invoice
        })
    }
    catch(err: any){
        console.log(err)
        return({
            success : false,
            error : err.message
        })
    }
}