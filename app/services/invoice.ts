import { PrismaClient } from "../generated/prisma";
import { CreateInvoice, createInvoiceSchema, DeleteInvoice, deleteInvoiceSchema, GetInvoice, getInvoicSchema, UpdateInvoice, updateInvoiceSchema } from "../types/invoice"
// model Invoice {
//     id        String   @id    @default(cuid())
//     userId    String
//     billTo    String
//     address   Address?
  
//     user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//     invoiceItems InvoiceItem[]
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
// }

export class Invoice{
    private prisma;

    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }

    async create({userId, billTo, address} : CreateInvoice){
        const { data, error } = createInvoiceSchema.safeParse({
            userId,
            billTo, 
            address
        });

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const newInvoice = await this.prisma.invoice.create({
                data : data
            })

            if(!newInvoice){
                throw new Error("Unable to create newInvoice");
            }

            return({
                success : true,
                data : newInvoice
            })
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    };

    async get({id} : GetInvoice){
        const { data, error } = getInvoicSchema.safeParse({
            id
        })

        if(error){
            return ({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoice.findFirst({
                where : {
                    id
                }
            });

            if(!result){
                throw new Error("Unable to fetch invoice")
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

    async getAll({id, userId, billTo, address} : GetInvoice){
        const { data, error } = getInvoicSchema.safeParse({
            id,
            userId,
            billTo,
            address
        });

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const result = await this.prisma.invoice.findMany({
                where: data
            });

            if(!result){
                throw new Error("Error fetching invoices")
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

    async update({ id, billTo, address } : UpdateInvoice){
        const { data, error } = updateInvoiceSchema.safeParse({
            id, 
            billTo,
            address,
        })

        if(error){
            return({
                success : false,
                error : error.message
            })
        }

        try{
            const { id, ...updateData } = data

            const result = await this.prisma.invoice.update({
                where : {
                     id
                },
                data : updateData
            })

            if(!result){
                throw new Error("Error Updating Invoice data");
            }

            return({
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

    async delete({ id } : DeleteInvoice){
        const { data, error } = deleteInvoiceSchema.safeParse({
            id
        });

        if(error){
            return({
                success : true,
                error : error.message
            })
        }

        try{
            await this.prisma.invoice.delete({
                where : {
                    id
                }
            })
            
            return({
                success : true,
                message : "Invoice Deleted"
            })
        }
        catch(err: any){
            return({
                success : false,
                error : err.message
            })
        }
    }
}