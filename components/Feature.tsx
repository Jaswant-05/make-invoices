import { Clock, FileText, Globe, Shield, Users, Zap } from "lucide-react";
import { Card } from "./ui/card";

export default function Feature() {
    return (
        <>
            <section id="features" className="py-24 bg-gray-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
                            Everything you need to
                            <span className="block">get paid faster</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to streamline your invoicing process and improve cash flow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Create professional invoices in under 60 seconds with our intuitive builder."
                            },
                            {
                                icon: Shield,
                                title: "Bank-Level Security",
                                description: "Your data is protected with enterprise-grade encryption and security measures."
                            },
                            {
                                icon: Globe,
                                title: "Global Ready",
                                description: "Multi-currency support with automatic tax calculations for 100+ countries."
                            },
                            {
                                icon: FileText,
                                title: "Smart Templates",
                                description: "Choose from dozens of professionally designed templates or create your own."
                            },
                            {
                                icon: Users,
                                title: "Team Collaboration",
                                description: "Work together with your team and manage client relationships seamlessly."
                            },
                            {
                                icon: Clock,
                                title: "Automated Reminders",
                                description: "Never chase payments again with smart, automated follow-up reminders."
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="p-8 border-0 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}