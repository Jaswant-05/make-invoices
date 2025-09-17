"use client"
import dynamic from 'next/dynamic';
import InvoiceForm from "@/components/InvoiceForm";
const InvoicePreview = dynamic(() => import('@/components/InvoicePreview'), {
    ssr: false,
});
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { invoiceFormSchema } from "../types/invoice";
import { useEffect } from 'react';
import { createPdfBlob } from '../utils/create-pdf-blob';



export default function Dashboard() {
    // TODO : Need to get actual company details from the backend to be the default values
    // TODO : Save button in side form component still pending which will take the form data and make fill the actual db tables


    async function handleDownload() {
        try {
            const formValues = form.getValues();
            const pdfBlob = await createPdfBlob({ invoice: formValues });

            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;

            const invoiceNumber = `${formValues.invoicePrefix}${formValues.invoiceSerialNumber}`;
            const date = new Date(formValues.invoiceDate).toISOString().split('T')[0];
            const filename = `Invoice-${invoiceNumber}-${date}.pdf`;

            link.download = filename;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Failed to download PDF:', error);
            //TODO : change to toast
            alert('Failed to download PDF. Please try again.');
        }
    }

    useEffect(() => {
        //Do the initial DB call here to get the company details
    }, []);

    const form = useForm<z.infer<typeof invoiceFormSchema>>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            companyName: "",
            companyAddress: "",
            companyEmail: "",
            companyNumber: "",
            toCompany: "",
            toEmail: "",
            currency: "USD",
            invoicePrefix: "INV-",
            invoiceSerialNumber: "001",
            invoiceDate: new Date(),
            paymentTerms: "Due upon receipt",
            additionalNotes: "",
            invoiceItems: []
        },
    });

    return (
        <div className="flex h-full min-h-0 flex-col md:flex-row">
            <div className="flex-1 min-w-0 border-r">
                <InvoiceForm form={form} handleDownload={handleDownload}/>
            </div>
            <div className="flex-1 min-w-0">
                <InvoicePreview form={form} />
            </div>
        </div>
    );
} 