import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm" id="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('/')}>
                        <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center mr-2">
                            <span className="text-white font-heading font-bold text-lg">F</span>
                        </div>
                        <span className="font-heading font-bold text-lg text-brand-dark">
                            FIT<span className="text-brand-orange">FACTOR</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => handleNavClick('/')} className="font-sans font-medium text-brand-dark hover:text-brand-purple transition-colors">Home</button>
                        <button onClick={() => handleNavClick('/about')} className="font-sans font-medium text-brand-dark hover:text-brand-purple transition-colors">About Us</button>
                        <button onClick={() => handleNavClick('/pricing')} className="font-sans font-medium text-brand-dark hover:text-brand-purple transition-colors">Pricing & Plans</button>
                        <button onClick={() => handleNavClick('/contact')} className="font-sans font-medium text-brand-dark hover:text-brand-purple transition-colors">Contact</button>
                        <button onClick={() => handleNavClick('/contact')} className="btn-modern px-6 py-2.5 bg-brand-purple text-white font-bold uppercase text-sm tracking-wider rounded hover:bg-brand-dark transition-colors">
                            Book Consultation
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMobileMenu} className="text-brand-dark hover:text-brand-purple focus:outline-none">
                            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden absolute w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1">
                    <button onClick={() => handleNavClick('/')} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-brand-dark hover:bg-gray-50 hover:text-brand-purple">Home</button>
                    <button onClick={() => handleNavClick('/about')} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-brand-dark hover:bg-gray-50 hover:text-brand-purple">About Us</button>
                    <button onClick={() => handleNavClick('/pricing')} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-brand-dark hover:bg-gray-50 hover:text-brand-purple">Pricing & Plans</button>
                    <button onClick={() => handleNavClick('/contact')} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-brand-dark hover:bg-gray-50 hover:text-brand-purple">Contact</button>
                    <button onClick={() => handleNavClick('/contact')} className="w-full block px-3 py-3 mt-4 text-center rounded bg-brand-orange text-white font-bold uppercase">Book Now</button>
                </div>
            </div>
        </nav>
    );
}
