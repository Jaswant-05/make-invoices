import { z } from "zod";
import { invoiceItemSchema } from "./invoiceItem";
export const invoiceSchema = z.object({
    id : z.cuid(),
    userId : z.cuid(),
    billTo : z.email(),
    address : z.string().optional(),        
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
    id : true,
    billTo : true,
    address : true,
})

export const getInvoicSchema = invoiceSchema.pick({
    id : true,
    userId : true,
    billTo : true,
    address : true,
})

export const deleteInvoiceSchema = invoiceSchema.pick({
    id : true
})

export const invoiceItemFormSchema = z.object({
    name: z.string().min(1, { message: "Item name is required" }),
    amount: z.number().min(0, { message: "Amount must be positive" }),
    quantity: z.number().min(1),
    invoiceId : z.cuid().optional()
})

export const invoiceFormSchema = z.object({
    logo : z.url().optional(),
    companyName : z.string().min(3, {message : "Company name is required"}),
    companyAddress : z.string().min(8, {message : "valid address is required"}),
    companyEmail : z.email({message : "Company Email is required"}),
    companyNumber : z.string().length(10, {
        message : "Phone number should be 10 digits"
    }),
    toCompany : z.string().min(3, {message : "Client Name is required"}),
    toEmail : z.email({message : "Client Email is Required"}),
    currency : z.string().length(3, {message : "Please select a valid currency"}),
    invoicePrefix : z.string().min(1, {message : "Invoice Prefix is required"}),
    invoiceSerialNumber : z.string().min(1, {message : "Serial number is required"}),
    invoiceDate : z.date({message : "Invoice date is required"}),
    paymentTerms : z.string().optional(),
    invoiceItems : z.array(invoiceItemFormSchema).min(1, {
        message : "At least 1 Invoice Item is required"
    }),
    additionalNotes: z.string().optional()
})

export type Invoice = z.infer<typeof invoiceSchema>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice= z.infer<typeof updateInvoiceSchema>;
export type GetInvoice = z.infer<typeof getInvoicSchema>;
export type DeleteInvoice = z.infer<typeof deleteInvoiceSchema>;
export type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>