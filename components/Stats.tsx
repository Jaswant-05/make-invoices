export default function Stats() {
    return (
        <>
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "60s", label: "Average Setup Time" },
                            { number: "0%", label: "Setup Fees" },
                            { number: "99.9%", label: "Uptime" },
                            { number: "24/7", label: "Support" }
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <div className="text-4xl md:text-5xl font-bold text-black mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}