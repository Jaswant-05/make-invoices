"use client"

import { invoiceFormSchema } from "@/app/types/invoice";
import { FormTest } from "./FormTest";
import { UseFormReturn } from "react-hook-form";
import { Calendar as CalendarIcon, ListPlus } from "lucide-react"
import { format } from "date-fns"
import { useFieldArray } from "react-hook-form";
import z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Textarea } from "./ui/textarea";
import { currency_codes } from "@/utils/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import InvoiceItemModal, { createInvoiceItemForm } from "./InvoiceItemModal";
import { createInvoice } from "@/app/action/invoice";
import { toast } from "sonner";

interface InvoiceFormProps {
    form: UseFormReturn<z.infer<typeof invoiceFormSchema>>
    handleDownload : () => void
}

export default function InvoiceForm({ form , handleDownload}: InvoiceFormProps) {
    const [modal, setModal] = useState(false)
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "invoiceItems"
    })

    async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
        try{
            const result = await createInvoice(values);
            if(result.error){
                throw new Error(`Error creating Invoice ${result.error.message}`)
            }

            toast.success("Successfully Saved Invoice")
        }
        catch(err: any){
            console.error("Error creating Invoice", err)
            toast.warning("Error in creating an Invoice")
        }

    }

    function handleModal() {
        setModal(x => !x)
    }

    function handleAddItem(item: createInvoiceItemForm) {
        append(item)
        setModal(false)
    }

    return (
        <div className="flex-1 border-r h-full">
            {/* <FormTest/> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Company Details</AccordionTrigger>
                            <AccordionContent>
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="numericnest.inc" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Name on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyEmail"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Company Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="numericnest@nx.com" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Email on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyAddress"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Company Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="123 Dundas Street, Toronto, ON" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Name on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyNumber"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Company Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="6477890021" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Number on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Customer Details</AccordionTrigger>
                            <AccordionContent>
                                <FormField
                                    control={form.control}
                                    name="toCompany"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Customer Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="company.inc" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Name on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="toEmail"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Customer Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="customer@example.com" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Company Name on Invoice.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Invoice Details</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex gap-8">
                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex-1">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Currency</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={"USD"} >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a valid currency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {currency_codes.map((code, index) => (
                                                            <SelectItem key={index} value={code}>
                                                                {code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Currency.
                                                </FormDescription>
                                                <FormMessage className="text-[0.65rem]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="invoiceDate"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex  flex-1 flex-col">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Date.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-8">
                                    <FormField
                                        control={form.control}
                                        name="invoicePrefix"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex-1">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Invoice Prefix</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Invoice INV-" {...field} />
                                                </FormControl>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Invoice Prefix.
                                                </FormDescription>
                                                <FormMessage className="text-[0.65rem]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="invoiceSerialNumber"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex-1">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Serial Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="444" {...field} className="tracking-tight" />
                                                </FormControl>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Company Name on Invoice.
                                                </FormDescription>
                                                <FormMessage className="text-[0.65rem]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-8">
                                    <FormField
                                        control={form.control}
                                        name="paymentTerms"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex-1">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Payment Terms</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="100% Due Now" {...field} className="tracking-tight" />
                                                </FormControl>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Payment Terms.
                                                </FormDescription>
                                                <FormMessage className="text-[0.65rem]" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tax"
                                        render={({ field }) => (
                                            <FormItem className="mb-4 flex-1">
                                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Tax Rate</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="" {...form.register("tax", { valueAsNumber: true })}  className="tracking-tight" />
                                                </FormControl>
                                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                    &#9432; Tax rate.
                                                </FormDescription>
                                                <FormMessage className="text-[0.65rem]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Invoice Items</AccordionTrigger>
                            <AccordionContent className="flex flex-col">
                                <div className="space-y-2 mb-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-md shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-neutral-900 tracking-tight">{field.name}</span>
                                                {field.quantity && (
                                                    <span className="text-xs text-neutral-500 tracking-tight">
                                                        • Qty: {field.quantity}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-neutral-900 tracking-tight">
                                                    ${field.amount.toFixed(2)}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="h-7 w-7 p-0 text-neutral-400 hover:text-neutral-600"
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {fields.length === 0 && (
                                        <p className="text-sm text-neutral-500 text-center py-4">No items added yet</p>
                                    )}
                                </div>
                                <Button onClick={handleModal} variant={"outline"} type="button" className="flex-1">
                                    <ListPlus /> Add Invoice Item
                                </Button>
                                {form.formState.errors.invoiceItems?.message && <p className="text-red-500 text-[0.65rem] pt-4 tracking-tight">{form.formState.errors.invoiceItems.message}</p>}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                        <AccordionItem value="item-5">
                            <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Notes</AccordionTrigger>
                            <AccordionContent>
                                <FormField
                                    control={form.control}
                                    name="additionalNotes"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel className="text-sm text-neutral-600 tracking-tight">Additional Notes</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Any Additional Notes" {...field} className="tracking-tight" />
                                            </FormControl>
                                            <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                                &#9432; Any Additional Notes.
                                            </FormDescription>
                                            <FormMessage className="text-[0.65rem]" />
                                        </FormItem>
                                    )}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="hidden md:flex items-center justify-end mb-0 mt-1 p-4 gap-2">
                        <Button type="submit">Save</Button>
                        <Button type="button" variant={"outline"} onClick={handleDownload}>Download</Button>
                    </div>
                </form>
            </Form>
            {modal && <InvoiceItemModal onAddItem={handleAddItem} onClose={() => setModal(false)} />}
        </div>
    )
}