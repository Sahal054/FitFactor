import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Award, Calendar } from 'lucide-react';
import Seo from '../components/Seo';
import { mockAboutPageData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';

const statIcons = {
  users: Users,
  award: Award,
  calendar: Calendar,
};

export default function About() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockAboutPageData : null);

  useEffect(() => {
    let isMounted = true;

    api
      .getAboutPageData()
      .then((data) => {
        if (isMounted) {
          setPageData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load about page data.', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading about page...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.header.title}
        description={pageData.header.subtitle}
        path="/about"
      />

      <div className="bg-brand-purple py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight uppercase">{pageData.header.title}</h1>
          <p className="text-lg md:text-lg font-medium text-brand-orange mb-6 tracking-wide">
            {pageData.header.subtitle}
          </p>
          <div className="w-24 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-10 leading-[1.1] tracking-tight">
                {pageData.headline.prefix}{' '}
                <span className="text-brand-purple">{pageData.headline.highlight}</span>
                {pageData.headline.suffix}
              </h2>

              <div className="space-y-8 mb-12 max-w-[65ch]">
                {pageData.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">{section.title}</h3>
                    <p className="text-gray-600 font-sans text-lg leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 py-8 border-y border-gray-100">
                {pageData.stats.map((stat) => {
                  const Icon = statIcons[stat.iconKey];

                  return (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm uppercase text-brand-dark">{stat.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex">
                <button
                  onClick={() => navigate(pageData.cta.path)}
                  className="bg-brand-orange text-white px-10 py-5 font-black uppercase tracking-wider rounded-xl hover:bg-brand-orange-hover hover:-translate-y-1 transition-all shadow-xl shadow-brand-orange/20 flex items-center gap-3"
                >
                  {pageData.cta.label}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-brand-gray/30 rounded-[2.5rem] -z-10 transform rotate-2"></div>

              <img
                src={pageData.image.src}
                className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl relative z-10"
                alt={pageData.image.alt}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
