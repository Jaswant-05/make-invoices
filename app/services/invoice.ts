import { type PrismaClient } from "@prisma/client";
import { CreateInvoice, createInvoiceSchema, DeleteInvoice, deleteInvoiceSchema, GetInvoice, getInvoicSchema, UpdateInvoice, updateInvoiceSchema } from "../types/invoice";
import { BaseCRUD } from "./BaseCRUD";

export class Invoice extends BaseCRUD<any, CreateInvoice, UpdateInvoice, GetInvoice, DeleteInvoice> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'invoice');
    }

    protected getCreateSchema() {
        return createInvoiceSchema;
    }

    protected getUpdateSchema() {
        return updateInvoiceSchema;
    }

    protected getGetSchema() {
        return getInvoicSchema;
    }

    protected getDeleteSchema() {
        return deleteInvoiceSchema;
    }

    async getWithItems(invoiceId: string) {
        try {
            const result = await this.prisma.invoice.findFirst({
                where: { id: invoiceId },
                include: {
                    invoiceItems: true
                }
            });

            if (!result) {
                throw new Error("Invoice not found");
            }

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
