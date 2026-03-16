export default function Testimonials() {
    return (
        <section className="py-32 bg-gray-50 relative">
            {/* Subtle Top Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl lg:text-5xl font-black text-brand-dark tracking-tight">
                        REAL PEOPLE.<br className="hidden sm:block" /> REAL <span className="text-brand-purple">TRANSFORMATIONS.</span>
                    </h2>
                </div>

                {/* Testimonial Cards */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Arjun */}
                    <div className="bg-white p-10 lg:p-14 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative flex flex-col justify-between">
                        {/* Huge Decorative Quote */}
                        <div className="absolute top-6 left-8 text-6xl font-sans font-black text-brand-purple/10 pointer-events-none">"</div>

                        <p className="text-lg lg:text-lg font-medium italic text-gray-800 leading-snug mb-10 relative z-10 mt-6">
                            Lost 15kg and gained a new life. The coaches at FitFactor gave me the confidence to follow through. I've never felt stronger or more supported in my life.
                        </p>

                        <div className="flex items-center gap-5 mt-auto border-t border-gray-100 pt-6">
                            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=250&q=80" alt="Arjun R." className="w-20 h-20 rounded-full object-cover shadow-md" />
                            <div>
                                <h4 className="font-bold text-lg text-brand-dark">Arjun R.</h4>
                                <div className="inline-block mt-1 px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                                    LOST 15KG
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meera */}
                    <div className="bg-white p-10 lg:p-14 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative flex flex-col justify-between">
                        {/* Huge Decorative Quote */}
                        <div className="absolute top-6 left-8 text-6xl font-sans font-black text-brand-purple/10 pointer-events-none">"</div>

                        <p className="text-lg lg:text-lg font-medium italic text-gray-800 leading-snug mb-10 relative z-10 mt-6">
                            From zero confidence to loving the gym. As a complete beginner, I was intimidated. The community here is so welcoming. Now it's the best part of my day.
                        </p>

                        <div className="flex items-center gap-5 mt-auto border-t border-gray-100 pt-6">
                            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=250&q=80" alt="Meera S." className="w-20 h-20 rounded-full object-cover shadow-md" />
                            <div>
                                <h4 className="font-bold text-lg text-brand-dark">Meera S.</h4>
                                <div className="inline-block mt-1 px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full">
                                    CONFIDENCE GAINED
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
