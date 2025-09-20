"use server"
import { invoiceFormSchema, InvoiceFormSchema } from "../types/invoice";
import { getServerSession } from "next-auth";
import prisma from "../utils/db";
import { authOptions } from "../utils/auth-option";
// {
//     companyName: 'Numericnest.Inc',
//     companyAddress: '63 Iceland poppy trail, Brampton, ON, L7A 0N1',
//     companyEmail: 'jaswant@numericnest.com',
//     companyNumber: '6472203706',
//     toCompany: 'weone.inc',
//     toEmail: 'harsha@weone.ca',
//     invoiceCurrency: 'CAD',
//     invoicePrefix: 'INV-',
//     invoiceSerialNumber: '001',
//     invoiceDate: 2025-09-17T14:46:45.270Z,
//     paymentTerms: 'Due upon receipt',
//     invoiceItems: [ { name: 'Landing Page', amount: 2999 } ],
//     additionalNotes: ''
// }

export async function createInvoice(formData : InvoiceFormSchema){
    console.log("here")
    const { data, error } = invoiceFormSchema.safeParse(formData);
    if(error){
        return({
            success : false,
            error : error.message
        })
    }

    const session = getServerSession(authOptions)
    if(!session){
        return({
            success : false,
            error : "Unauthorized"
        })
    }

    try{
        console.log("inside try/catch")
        const invoiceTotal = data.invoiceItems.reduce(
            (acc, curr) => acc + (curr.quantity ?? 1) * curr.amount,
            0
          );
          
          const { invoiceItems, ...payload } = {
            ...data,
            total: invoiceTotal,
            userId: "cmfiqwnhg0000yhj0ubu1amy0",        
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

          console.log("success")
          return({
            success : true,
            data : invoice
          })
    }
    catch(err: any){
        return({
            success : false,
            error : err.message
        })
    }
}