import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function OfferPopup({ offer }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!offer?.enabled) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, offer.delayMs || 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [offer]);

  if (!offer?.enabled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center offer-popup transition-opacity duration-500">
      <div className="bg-white rounded-lg p-1 max-w-lg w-[90%] md:w-full shadow-2xl transform transition-transform duration-300 scale-100">
        <div className="relative bg-gradient-to-br from-brand-purple to-brand-dark p-8 rounded-lg overflow-hidden text-center text-white">
          <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-orange rounded-full blur-3xl opacity-20"></div>

          <h3 className="text-2xl font-bold mb-2 text-brand-orange">{offer.title}</h3>
          <p className="text-lg mb-6 font-sans">{offer.description}</p>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6 border border-white/10">
            <p className="text-sm font-sans mb-1 text-gray-300">Use Code:</p>
            <div className="text-lg font-mono tracking-widest font-bold text-brand-orange">{offer.promoCode}</div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              navigate(offer.ctaPath);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 bg-brand-orange text-white font-bold uppercase tracking-wider hover:bg-brand-orange-hover transition-colors rounded"
          >
            {offer.ctaLabel}
          </button>
          <p className="text-xs text-gray-400 mt-4 font-sans">{offer.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
