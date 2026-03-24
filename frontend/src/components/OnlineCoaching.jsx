import { useNavigate } from 'react-router-dom';
import { Smartphone, Video, Utensils } from 'lucide-react';

const benefitIcons = {
  smartphone: Smartphone,
  utensils: Utensils,
  video: Video,
};

export default function OnlineCoaching({ content }) {
  const navigate = useNavigate();

  return (
    <section className="bg-brand-dark text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'0 0 2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      ></div>

      <div className="mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 items-stretch min-h-[600px] lg:min-h-[700px]">
          <div className="order-2 lg:order-1 relative h-[400px] lg:h-auto w-full">
            <img
              src={content.image.src}
              alt={content.image.alt}
              className="absolute inset-0 w-full h-full object-cover rounded-tr-[3rem] lg:rounded-tr-[4rem] rounded-br-[3rem] lg:rounded-br-[4rem] shadow-2xl filter grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 via-transparent to-brand-dark/20 mix-blend-multiply rounded-tr-[3rem] lg:rounded-tr-[4rem] rounded-br-[3rem] lg:rounded-br-[4rem]"></div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-20 lg:py-24 max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-[2px] bg-brand-orange"></span>
              <span className="text-brand-orange font-bold tracking-[0.2em] uppercase text-sm">{content.badge}</span>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black mb-6 leading-[1.1] tracking-tight">
              {content.titleTop}
              <br className="hidden sm:block" />
              {content.titleBottom}
            </h2>

            <p className="text-gray-300 text-lg xl:text-lg mb-12 font-medium leading-snug">{content.description}</p>

            <div className="space-y-8 mb-12">
              {content.benefits.map((benefit) => {
                const Icon = benefitIcons[benefit.iconKey];

                return (
                  <div key={benefit.title} className="flex items-start gap-5">
                    <div className="bg-brand-purple/20 p-3 rounded-lg text-brand-purple-light shrink-0 mt-1">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className="font-bold text-lg tracking-wide mb-1">{benefit.title}</span>
                      <span className="text-gray-400 font-sans text-base">{benefit.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-brand-purple/20">
              <button
                onClick={() => navigate(content.cta.path)}
                className="w-full sm:w-auto px-10 py-5 bg-brand-orange text-white font-bold uppercase tracking-wider rounded-lg hover:bg-brand-orange-hover hover:scale-[1.02] transform transition-all shadow-xl shadow-brand-orange/20 text-lg flex items-center justify-center gap-3"
              >
                {content.cta.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
