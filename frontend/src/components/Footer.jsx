import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();

    const handleNavClick = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-brand-dark text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 3-Column Structured Layout */}
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-16">

                    {/* Brand & Address */}
                    <div>
                        <span className="font-heading font-black text-3xl text-white mb-6 block tracking-tight">
                            FIT<span className="text-brand-orange">FACTOR</span>
                        </span>
                        <p className="text-gray-400 font-sans text-lg leading-relaxed mb-8">
                            123 Gym Street, Chinnakada<br />Kollam, Kerala 691001
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-orange hover:-translate-y-1 transition-all">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-orange hover:-translate-y-1 transition-all">
                                <i className="fab fa-youtube text-xl"></i>
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-orange hover:-translate-y-1 transition-all">
                                <i className="fab fa-facebook-f text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black mb-8 text-white tracking-widest uppercase">QUICK LINKS</h4>
                        <ul className="space-y-4 font-sans text-gray-400 text-lg">
                            <li><button onClick={() => handleNavClick('/')} className="hover:text-brand-orange transition-colors">Home</button></li>
                            <li><button onClick={() => handleNavClick('/about')} className="hover:text-brand-orange transition-colors">About Us</button></li>
                            <li><button onClick={() => handleNavClick('/pricing')} className="hover:text-brand-orange transition-colors">Plans</button></li>
                            <li><button onClick={() => handleNavClick('/contact')} className="hover:text-brand-orange transition-colors">Contact</button></li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-lg font-black mb-8 text-white tracking-widest uppercase">HOURS</h4>
                        <ul className="space-y-4 font-sans text-gray-400 text-lg">
                            <li className="flex justify-between border-b border-gray-800 pb-4">
                                <span>Mon - Sun</span>
                                <span className="font-medium text-white">5:00 AM - 11:00 PM</span>
                            </li>
                            <li className="pt-2 text-brand-orange font-bold uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                                Open All Days
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Separator and Copyright */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-gray-500">
                    <div>
                        &copy; 2025 FitFactor. All Rights Reserved.
                    </div>
                    <div className="mt-4 md:mt-0 font-medium">
                        Crafted with passion by <a href="#" className="text-gray-400 hover:text-white transition-colors">Wahn Design</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
