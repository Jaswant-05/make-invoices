import { FileText } from "lucide-react";

export default function Footer() {
    return (
        <>
            <footer className="border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <FileText className="w-6 h-6 text-black" />
                            <span className="text-lg font-bold text-black">Make Invoices</span>
                        </div>
                        <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <a href="#" className="hover:text-black transition-colors">Privacy</a>
                            <a href="#" className="hover:text-black transition-colors">Terms</a>
                            <a href="#" className="hover:text-black transition-colors">Support</a>
                            <span>© 2024 Make Invoices. All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}