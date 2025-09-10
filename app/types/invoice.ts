import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";

export const invoiceSchema = z.object({
    id : z.cuid(),
    userId : z.cuid(),
    billTo : z.email(),
    address : z.string(),        //keeping it as string for now but needs to be changes to the address zod schema once done
    invoiceItems : z.array<typeof invoiceItemSchema>,
    createdAt : z.date(),
    updatedAt : z.date()
})


export const createInvoiceSchema = invoiceSchema.pick({
    userId : true,
    billTo : true,
    address : true
})

export const updateInvoiceSchema = invoiceSchema.pick({
    billTo : true,
    address : true,
})

export const getInvoicSchema = invoiceSchema.pick({
    id : true,
    userId : true,
    billTo : true,
    address : true,
    createdAt : true,
    updatedAt : true
})

export const deleteInvoiceSchema = invoiceSchema.pick({
    id : true
})


export type Invoice = z.infer<typeof invoiceSchema>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice= z.infer<typeof updateInvoiceSchema>;
export type GetInvoice = z.infer<typeof getInvoicSchema>;
export type DeleteInvoice = z.infer<typeof deleteInvoiceSchema>;