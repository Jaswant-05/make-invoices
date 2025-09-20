import { FileText } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <header className="relative z-50 border-b border-gray-100/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <FileText className="w-7 h-7 text-black" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-pulse" />
                            </div>
                            <span className="text-xl font-bold text-black tracking-tight">Make Invoices</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-black transition-colors duration-200">Features</a>
                            <a href="#testimonials" className="text-gray-600 hover:text-black transition-colors duration-200">Reviews</a>
                            <a href="#pricing" className="text-gray-600 hover:text-black transition-colors duration-200">Pricing</a>
                            <Link href="/signin">
                                <Button variant="ghost" className="text-gray-600 hover:text-black">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-black text-white hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    Get Started
                                </Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}