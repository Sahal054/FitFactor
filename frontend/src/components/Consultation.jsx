export default function Consultation() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Request sent! We will contact you shortly.');
    };

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="bg-white p-8 md:p-14 lg:p-16 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="text-center mb-12 relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4 tracking-tight leading-[1.1]">
                            START YOUR <span className="text-brand-purple">JOURNEY</span> TODAY
                        </h2>
                        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                            Not sure where to begin? Book a free consultation. We'll assess your fitness level and create a roadmap for your goals.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-8 text-left">
                            <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Main Goal</label>
                            <select
                                defaultValue=""
                                className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white text-brand-dark cursor-pointer appearance-none"
                            >
                                <option value="" disabled>Select your primary objective...</option>
                                <option value="Weight Loss">Weight Loss & Fat Burning</option>
                                <option value="Muscle Gain">Muscle Building & Strength</option>
                                <option value="General Fitness">General Fitness & Mobility</option>
                                <option value="Online Coaching">Remote / Online Coaching</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-brand-orange text-white text-lg font-black uppercase tracking-wider rounded-xl hover:bg-brand-orange-hover transition-all shadow-xl shadow-brand-orange/20 transform hover:-translate-y-1 hover:shadow-brand-orange/40"
                        >
                            CLAIM YOUR FREE CONSULTATION
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-5 font-medium">
                            No spam. No obligation. Just a quick call to see how we can help.
                        </p>
                    </form>

                    {/* Trust Indicators */}
                    <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm font-bold text-gray-400 uppercase tracking-widest relative z-10">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-calendar-check text-brand-purple/50 text-lg"></i>
                            <span>Open 7 Days</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-users text-brand-purple/50 text-lg"></i>
                            <span>1000+ Members</span>
                        </div>
                        <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-certificate text-brand-purple/50 text-lg"></i>
                            <span>Certified Pros</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
