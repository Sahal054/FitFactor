import { Edit3, Users, BookOpen } from 'lucide-react';

export default function DailyLiveWorkouts() {
    return (
        <section className="py-24 bg-brand-gray/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Centered Structured Header */}
                <div className="text-center max-w-4xl mx-auto mb-14">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange font-bold tracking-[0.2em] uppercase text-xs mb-4">
                        Virtual Fitness
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-black text-brand-dark mb-6 leading-[0.9] tracking-tight">
                        DAILY LIVE <br className="hidden sm:block" />
                        <span className="text-brand-purple">WORKOUT SESSIONS</span>
                    </h2>
                    <p className="text-gray-600 font-medium text-lg lg:text-lg leading-snug">
                        Train live. Get corrected in real time. Stay accountable.
                    </p>
                </div>

                {/* Video Block with Deep Shadow and Radius */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-brand-dark ring-1 ring-black/5 transform transition-transform hover:scale-[1.01] duration-500">
                    <video className="w-full aspect-video object-cover relative z-10" controls poster="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1920&q=80">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* 3-Feature Row Underneath Video */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4 lg:px-12">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-purple mb-4 group-hover:-translate-y-1 transition-transform">
                            <Edit3 className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg text-brand-dark mb-1">Live Corrections</h4>
                        <p className="text-gray-500 font-sans text-sm">Real-time form checks to prevent injury.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-purple mb-4 group-hover:-translate-y-1 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg text-brand-dark mb-1">Community Support</h4>
                        <p className="text-gray-500 font-sans text-sm">Sweat alongside members everywhere.</p>
                    </div>

                    <div className="flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-purple mb-4 group-hover:-translate-y-1 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg text-brand-dark mb-1">Structured Programs</h4>
                        <p className="text-gray-500 font-sans text-sm">Follow a specialized daily routine.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
