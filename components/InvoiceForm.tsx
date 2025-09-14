"use client"

import { invoiceFormSchema } from "@/app/types/invoice";
import { FormTest } from "./FormTest";
import { UseFormReturn } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import z from "zod";
import { Form,
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
import { currency_codes } from "@/app/utils/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
    form : UseFormReturn<z.infer<typeof invoiceFormSchema>>
}

export default function InvoiceForm({ form } : InvoiceFormProps){
    function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
        //need to make the db call here to update the database on Save/Download
        console.log(values)
    }

    return(
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
                                    <Input placeholder="numericnest.inc" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
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
                                    <Textarea placeholder="123 Dundas Street, Toronto, ON" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
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
                                    <Input placeholder="6477890021" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Number on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
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
                                    <Input placeholder="company.inc" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Customer Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="customer@example.com" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
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
                                name="invoiceCurrency"
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
                                    <FormMessage className="text-[0.65rem]"/>
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
                                        <Input placeholder="Invoice INV-" {...field}/>
                                    </FormControl>
                                    <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                        &#9432; Invoice Prefix.
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]"/>
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
                                        <Input placeholder="444" {...field}  className="tracking-tight"/>
                                    </FormControl>
                                    <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                        &#9432; Company Name on Invoice.
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]"/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="paymentTerms"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Payment Terms</FormLabel>
                                <FormControl>
                                    <Input placeholder="100% Due Now" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Payment Terms.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
                                </FormItem>
                            )}
                        />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <Accordion type="single" collapsible className="border px-4 py-1 border-neutral-100 mb-0">
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-md text-neutral-800 font-medium tracking-tight">Invoice Items</AccordionTrigger>
                        <AccordionContent>
                        <FormField
                            control={form.control}
                            name="toCompany"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Customer Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="company.inc" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className="text-sm text-neutral-600 tracking-tight">Customer Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="customer@example.com" {...field}  className="tracking-tight"/>
                                </FormControl>
                                <FormDescription className="text-[0.65rem] tracking-tight text-neutral-500">
                                    &#9432; Company Name on Invoice.
                                </FormDescription>
                                <FormMessage className="text-[0.65rem]"/>
                                </FormItem>
                            )}
                        />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                {/* <Button type="submit">Submit</Button> */}
                </form>
            </Form>
        </div>
    )
}