import { Star } from "lucide-react";
import { Card } from "./ui/card";

export default function Testimonials() {
    return (
        <>
            <section id="testimonials" className="py-24 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                            Built for the modern
                            <span className="block">business owner</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Finally, an invoicing tool that doesn't feel outdated. The design is absolutely beautiful.",
                                author: "Alex Morgan",
                                role: "Design Studio Owner",
                                rating: 5
                            },
                            {
                                quote: "I've tried every invoicing app out there. This one actually gets it right.",
                                author: "Jordan Smith",
                                role: "Freelance Designer",
                                rating: 5
                            },
                            {
                                quote: "Clean, fast, and exactly what I needed. No bloated features, just pure functionality.",
                                author: "Taylor Johnson",
                                role: "Consultant",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div>
                                    <div className="font-semibold text-black">{testimonial.author}</div>
                                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}