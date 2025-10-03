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
import { useEffect, useState } from 'react';
import { createPdfBlob } from '../utils/create-pdf-blob';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createInvoice } from '../action/invoice';
import axios from "axios"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type User = {
    id: string,
    name: string,
    email: string,
    number: string | null,
    address: string | null
}

export default function Dashboard() {
    const [showPreview, setShowPreview] = useState(false);
    const [user, setUser] = useState<User>({
        id: "",
        name: "",
        email: "",
        number: "",
        address: ""
    });
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const router = useRouter()
    const session = useSession()

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
            toast.warning('Failed to download PDF. Please try again.');
        }
    }

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
            invoiceItems: [],
            tax : 0 
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (session.status !== "authenticated" || isDataLoaded) return;
            
            try {
                const res = await axios.get("/api/user");
                const userData = res.data.data;
                setUser(userData);

                form.setValue("companyName", userData.name);
                form.setValue("companyEmail", userData.email);

                userData.address && form.setValue("companyAddress", userData.address);
                userData.number && form.setValue("companyNumber", userData.number);
                setIsDataLoaded(true);
            } catch (err: any) {
                console.error(err.message);
            }
        };

        fetchUserData();
    }, [session.status, isDataLoaded, form]);

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push('/');
        }
    }, [session.status, router])

    if (session.status === "loading" || !isDataLoaded) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            <div className="md:hidden absolute top-0 left-0 right-0 p-4 border-b border-neutral-200 bg-white z-10">
                <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full flex items-center justify-center gap-2"
                >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row min-h-0 pt-20 md:pt-0 pb-20 md:pb-0 overflow-hidden">
                <div className={`
                    flex-1 min-w-0 h-full
                    ${showPreview ? 'hidden md:flex' : 'flex'}
                    md:border-r md:border-neutral-200
                    overflow-hidden
                `}>
                    <InvoiceForm form={form} handleDownload={handleDownload} />
                </div>
                <div className={`
                    flex-1 min-w-0 bg-neutral-50 h-full
                    ${showPreview ? 'flex' : 'hidden md:flex'}
                    overflow-hidden
                `}>
                    <InvoicePreview form={form} />
                </div>
            </div>
            <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-white z-10">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={form.handleSubmit(async (values) => {
                            try {
                                const result = await createInvoice(values);
                                if (result.error) {
                                    throw new Error(`Error creating Invoice ${result.error.message}`);
                                }
                                toast.success("Successfully Saved Invoice");
                            } catch (err: any) {
                                console.error("Error creating Invoice", err.message);
                                toast.warning("Error in creating an Invoice");
                            }
                        })}
                        className="flex-1"
                    >
                        Save
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDownload}
                        className="flex-1"
                    >
                        Download PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}