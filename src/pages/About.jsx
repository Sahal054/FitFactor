import { useNavigate } from 'react-router-dom';
import { Users, Award, Calendar } from 'lucide-react';

export default function About() {
    const navigate = useNavigate();

    return (
        <>
            {/* Header section (Reduced Height) */}
            <div className="bg-brand-purple py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight uppercase">WHO WE ARE</h1>
                    <p className="text-lg md:text-lg font-medium text-brand-orange mb-6 tracking-wide">
                        More than a gym. A results-driven community in Kollam.
                    </p>
                    <div className="w-24 h-1 bg-white/20 rounded-full"></div>
                </div>
            </div>

            {/* Main content (12-Column Grid) */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

                        {/* 6 Columns: Text Content */}
                        <div className="lg:col-span-6 flex flex-col justify-center">
                            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-10 leading-[1.1] tracking-tight">
                                A GYM BUILT ON <span className="text-brand-purple">COMMUNITY</span>, CARE, AND REAL PROGRESS.
                            </h2>

                            <div className="space-y-8 mb-12 max-w-[65ch]">

                                {/* Sub-section: Who we serve */}
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-2">Who We Serve</h3>
                                    <p className="text-gray-600 font-sans text-lg leading-relaxed">
                                        FitFactor is designed for real people — beginners, families, seniors, professionals, and students. Anyone who wants fitness to feel achievable, safe, and motivating.
                                    </p>
                                </div>

                                {/* Sub-section: What makes us different */}
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-2">What Makes Us Different</h3>
                                    <p className="text-gray-600 font-sans text-lg leading-relaxed">
                                        We combine expertise with empathy, discipline with warmth, and premium equipment with a highly inclusive atmosphere.
                                    </p>
                                </div>

                                {/* Sub-section: What you can expect */}
                                <div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-2">What You Can Expect</h3>
                                    <p className="text-gray-600 font-sans text-lg leading-relaxed">
                                        We are not just a place to workout; we are a place to belong. Expect pristine facilities, structured guidance, and a supportive team pushing you forward.
                                    </p>
                                </div>
                            </div>

                            {/* Credibility Bullets */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 py-8 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm uppercase text-brand-dark">1000+ Members</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm uppercase text-brand-dark">Certified Trainers</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-sm uppercase text-brand-dark">Open 7 Days a week</span>
                                </div>
                            </div>

                            {/* Solid CTA Button */}
                            <div className="flex">
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="bg-brand-orange text-white px-10 py-5 font-black uppercase tracking-wider rounded-xl hover:bg-brand-orange-hover hover:-translate-y-1 transition-all shadow-xl shadow-brand-orange/20 flex items-center gap-3"
                                >
                                    Join Our Family <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>

                        {/* 6 Columns: Image block */}
                        <div className="lg:col-span-6 relative">
                            {/* Decorative Architecture anchor */}
                            <div className="absolute -inset-4 bg-brand-gray/30 rounded-[2.5rem] -z-10 transform rotate-2"></div>

                            {/* Flush Flush Image */}
                            <img
                                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1000&q=80"
                                className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl relative z-10"
                                alt="About FitFactor Community"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
