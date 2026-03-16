export default function Features() {
    const features = [
        { num: '01', title: 'FREE InBody', desc: 'Track your progress with scientific accuracy. Body composition analysis included.' },
        { num: '02', title: 'FREE Steam Bath', desc: 'Premium recovery at no extra cost. Relax your muscles after a hard session.' },
        { num: '03', title: 'Open All Days', desc: 'Consistency without compromise. We are open 7 days a week for your grind.' },
        { num: '04', title: 'Freeze Anytime', desc: "Going out of town? Pause your plan when life happens so you don't lose days." },
        { num: '05', title: 'All-Day Hours', desc: 'Train when your schedule allows. Early morning to late night access.' },
        { num: '06', title: 'Multiple Disciplines', desc: 'Strength, Boxing, Animal Flow, and more everything under one roof.' },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl lg:text-5xl font-black text-brand-dark mb-4 tracking-tight leading-[1.1]">
                        THE MOST TRUSTED GYM IN KOLLAM
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
                        Built for results. Backed by science.
                    </p>
                </div>

                {/* Scannable Features Grid (Strict 3-Column Layout) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white border border-gray-100 p-10 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            {/* Massive Background Number */}
                            <div className="absolute -top-4 -right-4 text-7xl font-black text-brand-purple/5 select-none transition-colors duration-300 group-hover:text-brand-purple/10">
                                {feature.num}
                            </div>

                            {/* Foreground Content */}
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-purple transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
