import { MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate an API call / form submission
        setTimeout(() => {
            setIsSubmitted(true);
        }, 800);
    };

    return (
        <div className="bg-gray-50 pt-16 pb-32">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight uppercase">GET IN TOUCH</h1>
                    <p className="text-lg md:text-lg font-medium text-brand-orange">
                        Book a free consultation in under 30 seconds.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">

                    {/* Left Column: Info & Value Props */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="mb-12">
                            <h3 className="text-2xl font-black text-brand-dark mb-8 tracking-tight">STAY CONNECTED</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-brand-purple flex items-center justify-center rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-brand-dark mb-1">Visit Us</h4>
                                        <p className="text-gray-500 font-sans font-medium text-sm md:text-base leading-relaxed">
                                            123 Gym Street, Chinnakada,<br />Kollam, Kerala 691001
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-brand-purple flex items-center justify-center rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-brand-dark mb-1">Call Us</h4>
                                        <p className="text-gray-500 font-sans font-medium text-sm md:text-base leading-relaxed">
                                            +91 98765 43210
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why Book a Consultation Block */}
                        <div className="bg-white p-8 border border-gray-100 rounded-[2rem] shadow-sm">
                            <h4 className="font-bold text-lg text-brand-dark mb-6">Why Book a Consultation?</h4>
                            <ul className="space-y-4 font-sans text-gray-600 font-medium">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                    Free InBody composition analysis
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                    Custom personalized goal planning
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                    No commitment or pressure required
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden h-full flex flex-col justify-center">

                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                            {isSubmitted ? (
                                <div className="text-center relative z-10 py-12">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-dark mb-4">REQUEST RECEIVED</h3>
                                    <p className="text-gray-600 font-medium text-lg mb-10 max-w-sm mx-auto">
                                        Thank you! One of our fitness experts will call you within 24 hours to confirm your appointment.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="py-4 px-8 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-brand-dark hover:text-white transition-all hover:shadow-lg"
                                    >
                                        Send Another Request
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="relative z-10">
                                    <h3 className="text-2xl font-black text-brand-dark mb-8 tracking-tight">BOOK YOUR SLOT</h3>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    title="Please enter a valid 10-digit phone number"
                                                    className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all"
                                                    placeholder="98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Primary Goal</label>
                                            <select required className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all text-brand-dark appearance-none cursor-pointer">
                                                <option value="" disabled selected>Select your target...</option>
                                                <option value="Weight Loss">Weight Loss</option>
                                                <option value="Muscle Gain">Muscle Gain</option>
                                                <option value="General Fitness">General Fitness</option>
                                                <option value="Online Coaching">Online Coaching</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Message (Optional)</label>
                                            <textarea
                                                className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all resize-y min-h-[120px]"
                                                placeholder="Tell us about your fitness history, injuries, or specific concerns..."
                                            ></textarea>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full py-5 bg-brand-purple text-white text-lg font-black uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-purple/20 hover:shadow-brand-dark/30 hover:-translate-y-1"
                                            >
                                                Send Request
                                            </button>
                                            <p className="text-center text-sm font-medium text-gray-400 mt-4">
                                                We'll call you within 24 hours to confirm your spot.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
