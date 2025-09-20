import { ArrowRight, Clock, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero() {
    return (
        <>
            <section className="relative pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200 mb-8 group hover:border-gray-300 transition-all duration-300">
                            <Sparkles className="w-4 h-4 text-gray-600 mr-2 group-hover:text-black transition-colors" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                                The future of professional invoicing is here
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 tracking-tight leading-[1.1]">
                            Create Beautiful
                            <span className="block bg-gradient-to-r from-gray-900 via-black to-gray-700 bg-clip-text text-transparent">
                                Invoices in Seconds
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Professional invoicing made simple. Build, customize, and send stunning invoices
                            that get you paid faster. No design skills required.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="bg-black text-white hover:bg-gray-800 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                                >
                                    Start Creating Free
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4" />
                                <span>Secure & Private</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>2 min setup</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4" />
                                <span>Lightning fast</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-20 left-10 w-20 h-20 bg-gray-100 rounded-full opacity-50 animate-pulse" />
                <div className="absolute top-40 right-20 w-12 h-12 bg-black rounded-full opacity-20 animate-bounce" />
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gray-200 rounded-full opacity-30" />
            </section>
        </>
    )
}