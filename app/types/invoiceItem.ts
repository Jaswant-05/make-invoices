import { z } from "zod";

export const invoiceItemSchema = z.object({
    id : z.cuid(),
    name : z.string(),
    quantity : z.number(),
    amount : z.number(),
    invoiceId : z.cuid(),
    createdAt : z.date(),
    updatedAt : z.date()
});


export const createInvoiceItemSchema = invoiceItemSchema.omit({
    id : true,
    createdAt: true,
    updatedAt: true
});

export const updateInvoiceItemSchema = invoiceItemSchema.partial().omit({
    createdAt : true,
    updatedAt : true
});

export const getInvoiceItemSchema = invoiceItemSchema.partial();

export const deleteInvoiceItemSchema = invoiceItemSchema.omit({
    name : true,
    quantity : true,
    amount : true,
    invoiceId : true,
    createdAt : true,
    updatedAt : true
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceItem = z.infer<typeof createInvoiceItemSchema>;
export type UpdateInvoiceItem = z.infer<typeof updateInvoiceItemSchema>;
export type GetInvoiceItem = z.infer<typeof getInvoiceItemSchema>;
export type DeleteInvoiceItem = z.infer<typeof deleteInvoiceItemSchema>;

