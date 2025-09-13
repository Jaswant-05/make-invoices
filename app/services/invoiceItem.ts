import { type PrismaClient } from "../generated/prisma";
import { CreateInvoiceItem, createInvoiceItemSchema, DeleteInvoiceItem, deleteInvoiceItemSchema, GetInvoiceItem, getInvoiceItemSchema, UpdateInvoiceItem, updateInvoiceItemSchema } from "../types/invoiceItem";
import { success } from "zod";
import { BaseCRUD } from "./BaseCRUD";

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

export class InvoiceItem extends BaseCRUD<any, CreateInvoiceItem, UpdateInvoiceItem, GetInvoiceItem, DeleteInvoiceItem> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'invoiceItem');
    }

    protected getCreateSchema() {
        return createInvoiceItemSchema;
    }

    protected getUpdateSchema() {
        return updateInvoiceItemSchema;
    }

    protected getGetSchema() {
        return getInvoiceItemSchema;
    }

    protected getDeleteSchema() {
        return deleteInvoiceItemSchema;
    }

    async getByInvoiceId(invoiceId: string) {
        try {
            const result = await this.prisma.invoiceItem.findMany({
                where: { invoiceId }
            });

            return {
                success: true,
                data: result
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }
}