import { CreateInvoiceItem } from "@/app/types/invoiceItem";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type createInvoiceItemForm = Omit<CreateInvoiceItem, "invoiceId">

interface InvoiceItemModalProps {
    onAddItem: (item: createInvoiceItemForm) => void;
    onClose: () => void;
}

export default function InvoiceItemModal({ onAddItem, onClose }: InvoiceItemModalProps) {
    const form = useForm<createInvoiceItemForm>({
        defaultValues: {
            name: "",
            amount: 0,
            quantity: undefined
        }
    })

    function onSubmit(values: createInvoiceItemForm) {
        onAddItem(values)
        form.reset()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Add Invoice Item</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Service/Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            placeholder="0.00" 
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity (Optional)</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="1" 
                                                    value={field.value ?? ""} // Add this line
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        />
                        <div className="flex gap-2 pt-4">
                            <Button type="submit" className="flex-1">Add Item</Button>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}