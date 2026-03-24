import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';

export default function Navbar({ brand, navigation, primaryCta }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);

    if (path.includes('#')) {
      const [, sectionId] = path.split('#');

      if (location.pathname === '/') {
        if (location.hash !== `#${sectionId}`) {
          navigate(path);
        }

        scrollToSection(sectionId);
      } else {
        navigate(path);
      }

      return;
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm" id="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('/')}>
            <img src={brand.logoDarkPath} alt={brand.logoAlt} className="h-10 sm:h-11 w-auto" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="font-sans font-medium text-brand-dark hover:text-brand-purple transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick(primaryCta.path)}
              className="btn-modern px-6 py-2.5 bg-brand-purple text-white font-bold uppercase text-sm tracking-wider rounded hover:bg-brand-dark transition-colors"
            >
              {primaryCta.label}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-brand-dark hover:text-brand-purple focus:outline-none">
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-brand-dark hover:bg-gray-50 hover:text-brand-purple"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick(primaryCta.path)}
            className="w-full block px-3 py-3 mt-4 text-center rounded bg-brand-orange text-white font-bold uppercase"
          >
            {primaryCta.label}
          </button>
        </div>
      </div>
    </nav>
  );
}
