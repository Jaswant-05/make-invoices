import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/auth-option";
import { columns, Invoice } from "../../../components/columns"
import { DataTable } from "../../../components/table";
import prisma from "@/utils/db";
import axios from "axios";

async function getData(): Promise<Invoice[]> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        throw new Error("Not Authenticated")
    }

    const userId = session.user.id;
    const payload = await prisma.invoice.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            total_with_tax: true,
            toCompany: true,
            toEmail: true,
            blobName: true,
            createdAt: true
        }
    })

    const invoices: Invoice[] = payload.reduce((acc, curr) => {
        acc.push({
            id: curr.id,
            amount: curr.total_with_tax,
            to: curr.toCompany,
            email: curr.toEmail,
            date: curr.createdAt.toLocaleDateString(),
            blobName: curr.blobName
        });
        return acc;
    }, [] as Invoice[])

    return invoices
}

export async function download(invoiceId: string) {
    try {
        const { data } = await axios.get(`/api/azure?invoiceId=${invoiceId}`);
        const url = data?.url;
        const blobName = data?.blobName;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch PDF');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Invoice-${blobName}-${date}.pdf`;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);

    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download invoice. Please try again.');
    }
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const data = await getData()

    return (
        <div className="py-6 md:py-10 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Make Invoices</h1>
                <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
                    Manage and view all your invoices in one place.
                </p>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}