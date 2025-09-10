import { z } from "zod";

export const addressSchema = z.object({
    id : z.cuid(),
    address1 : z.string(),
    address2 : z.string().optional(),
    city : z.string(),
    province : z.string(),
    country : z.string(),

    invoiceId : z.cuid(),
    userId : z.cuid().optional()
});

export const createAddressSchema = addressSchema.pick({
    address1 : true,
    address2 : true,
    city : true,
    province : true,
    country : true,
    invoiceId : true
});

export const getAddressSchema = addressSchema.pick({
    id : true,
    invoiceId : true,
    userId : true
});

export const deleteAddress = addressSchema.pick({
    id : true
});

export type Address = z.infer<typeof addressSchema>;
export type CreateAddress = z.infer<typeof createAddressSchema>;
export type GetAddress = z.infer<typeof getAddressSchema>;
export type DeleteAddress = z.infer<typeof deleteAddress>;