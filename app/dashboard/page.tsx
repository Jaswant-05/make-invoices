"use client"

import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { invoiceFormSchema } from "../types/invoice";

export default function Dashboard() {

    const form = useForm<z.infer<typeof invoiceFormSchema>>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {},
    })

    return (
      <div className="flex h-full min-h-0 flex-col md:flex-row">
        <InvoiceForm form={form}/>
        <InvoicePreview />
      </div>
    )
  }