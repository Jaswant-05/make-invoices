import { type PrismaClient } from "@prisma/client/extension"
import { CreateInvoiceItem, createInvoiceItemSchema, DeleteInvoiceItem, deleteInvoiceItemSchema, GetInvoiceItem, getInvoiceItemSchema, UpdateInvoiceItem, updateInvoiceItemSchema } from "../types/invoiceItem";
import { success } from "zod";

// model InvoiceItem {
//     id        String    @id    @default(cuid())
//     name      String
//     quantity  Int?
//     amount    Int
//     invoiceId String
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
  
//     invoice   Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade )
// }

export class invoiceItem{
    private prisma; 

    constructor(prisma : PrismaClient){
        this.prisma = prisma
    }
       
    async create({name, amount, invoiceId, quantity} : CreateInvoiceItem){
        const { data, error } = createInvoiceItemSchema.safeParse({
            name,
            amount,
            invoiceId,
            quantity
        });

        if(error){
            return ({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoiceItem.create({
                data : data
            })

            if(!result){
                throw new Error("Error creating invoice item");
            }

            return {
                success : true,
                data : result,
                message : "Successfully created InvoiceItem"
            };
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    }

    async update({id, name, amount, invoiceId, quantity} : UpdateInvoiceItem){
        const { data, error } = updateInvoiceItemSchema.safeParse({
            id,
            name,
            amount,
            invoiceId,
            quantity
        })

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoiceItem.update({
                where : {
                    id : data.id
                },
                data
            })

            if(!result){
                throw new Error("Error Updating Invoice Item");
            }

            return({
                success : true,
                message : "Successfully created invoiceItem"
            })
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            });
        }
    }

    async get({ id } : GetInvoiceItem){
        const { data, error }  = getInvoiceItemSchema.safeParse({
            id,
        })

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoicItem.findFirst({
                where : data
            });

            if(!result){
                throw new Error("Error Fetching Invoice Items");
            }

            return({
                success : true,
                data : result
            })
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    }

    async getAll({name, invoiceId, createdAt, updatedAt, amount, quantity}: GetInvoiceItem){        //need to add pagination to this eventually
        const { data, error } = getInvoiceItemSchema.safeParse({
            name,
            invoiceId,
            createdAt,
            updatedAt,
            amount,
            quantity
        });

        if(error){
            return({
                success: false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoiceItem.findMany({
                where : data
            })

            if(!result){
                throw new Error("Error Fetching Invoice Items");
            }

            result({
                success : true,
                data : result
            });
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    }

    async delete({ id } : DeleteInvoiceItem){
        const { data, error } = deleteInvoiceItemSchema.safeParse({
            id
        });

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoiceItem.delete({
                where : {
                    id : data.id
                }
            })

            if(!result){
                throw new Error("Error deleting InvoiceItem");
            }

            return({
                success: true,
                message : "Invoice Item Deleted Successfully"
            });
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    }
}