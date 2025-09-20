import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CTA() {
    return (
        <>
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-tight">
                        Ready to get paid faster?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Start creating professional invoices that get you paid faster.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group"
                            >
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <p className="text-sm text-gray-500">No credit card required • 14-day free trial</p>
                    </div>
                </div>
            </section>
        </>
    )
}