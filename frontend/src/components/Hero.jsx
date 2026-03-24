import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function Hero({ content, whatsappUrl }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-24 sm:py-32 bg-white selection:bg-brand-purple selection:text-white">
      <div className="absolute inset-y-0 w-full lg:w-[45%] right-0 bg-brand-gray/30 -z-10 rounded-l-[100px] hidden lg:block"></div>

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 lg:col-span-6 animate-fade-in-up pr-4 lg:pr-8">
            <h1 className="flex flex-col text-brand-dark">
              <span className="text-lg sm:text-lg font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                {content.eyebrow}
              </span>
              <span className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tight">
                {content.title}
              </span>
              <span className="text-4xl sm:text-5xl lg:text-[4.75rem] font-bold leading-[0.9] tracking-tight text-brand-purple mt-1 lg:mt-2">
                {content.accentTitle}
              </span>
            </h1>

            <p className="text-lg sm:text-lg text-gray-600 font-sans max-w-lg leading-snug font-medium pt-2 pb-4">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-brand-purple text-white font-bold uppercase tracking-wider rounded-lg shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-3 text-lg whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5" />
                {content.primaryCtaLabel}
              </a>

              <button
                onClick={() => navigate(content.secondaryCta.path)}
                className="px-10 py-5 bg-transparent text-gray-600 border border-gray-300 font-bold uppercase tracking-wider rounded-lg hover:border-gray-800 hover:text-gray-900 transition-colors flex items-center justify-center text-lg whitespace-nowrap"
              >
                {content.secondaryCta.label}
              </button>
            </div>
          </div>

          <div className="relative lg:col-span-6 h-[400px] sm:h-[500px] lg:h-[650px] rounded-[2rem] overflow-hidden ml-auto w-full group">
            <img
              src={content.image.src}
              alt={content.image.alt}
              className="absolute inset-0 w-full h-full object-cover filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent mix-blend-multiply"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
