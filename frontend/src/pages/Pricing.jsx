import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Seo from '../components/Seo';
import { mockPricingPageData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';

export default function Pricing() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockPricingPageData : null);

  const handlePlanSelection = (planId) => {
    navigate(`/contact?plan=${planId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let isMounted = true;

    api
      .getPricingPageData()
      .then((data) => {
        if (isMounted) {
          setPageData(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load pricing page data.', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading pricing page...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.header.title}
        description={pageData.header.subtitle}
        path="/pricing"
      />

      <div className="bg-gray-50 pb-24">
        <div className="bg-brand-dark py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">{pageData.header.title}</h1>
          <p className="text-lg md:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            {pageData.header.subtitle}
          </p>
          <p className="text-brand-orange mt-2 font-bold tracking-wide text-sm md:text-base uppercase bg-brand-orange/10 px-4 py-1 rounded-full">
            {pageData.header.badge}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {pageData.plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 md:p-10 rounded-[2rem] transition-all duration-300 flex flex-col relative ${
                plan.featured
                  ? 'bg-brand-dark border-2 border-brand-orange shadow-2xl z-20 md:-mt-4 md:mb-4'
                  : 'bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 z-10'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                  {plan.featuredLabel}
                </div>
              )}

              <h3 className={`text-lg font-black mb-2 tracking-tight ${plan.featured ? 'text-white' : 'text-brand-dark'}`}>
                {plan.name}
              </h3>
              <p className={`mb-6 font-medium text-sm ${plan.featured ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="mb-2">
                <span className="text-lg font-bold text-gray-400 align-top mr-1">{plan.currency}</span>
                <span className={`text-4xl lg:text-5xl font-black tracking-tight ${plan.featured ? 'text-white' : 'text-brand-purple'}`}>
                  {plan.price}
                </span>
              </div>

              {plan.monthlyEquivalent ? (
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {plan.monthlyEquivalent}
                </div>
              ) : (
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 h-6 invisible">
                  Spacer
                </div>
              )}

              {plan.savings && (
                <div
                  className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 max-w-max border ${
                    plan.featured
                      ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/30'
                      : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
                  }`}
                >
                  {plan.savings}
                </div>
              )}

              {plan.savings && (
                <p className={`mb-8 text-sm font-medium ${plan.featured ? 'text-gray-300' : 'text-gray-500'}`}>
                  Discounted pricing stays attached when you continue.
                </p>
              )}

              <ul className={`space-y-5 text-base font-medium mb-10 flex-grow ${plan.featured ? 'text-gray-300' : 'text-gray-700'}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.featured ? 'text-brand-orange' : 'text-brand-purple'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelection(plan.id)}
                className={`w-full py-4 uppercase tracking-widest rounded-xl transition-all mt-auto ${
                  plan.featured
                    ? 'bg-brand-orange text-white font-black hover:bg-brand-orange-hover shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40'
                    : 'border-2 border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white hover:shadow-lg'
                }`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-2xl font-black text-brand-dark text-center tracking-tight">
              {pageData.comparisonTable.title}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="p-6 text-gray-400 font-bold uppercase tracking-wider text-sm w-1/3">Feature</th>
                  <th className="p-6 text-brand-dark font-black text-lg text-center w-[22%]">Monthly</th>
                  <th className="p-6 text-brand-orange font-black text-lg text-center w-[22%] bg-brand-orange/5">Quarterly</th>
                  <th className="p-6 text-brand-purple font-black text-lg text-center w-[22%]">Annual</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700 font-medium">
                {pageData.comparisonTable.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">{row.feature}</td>
                    <td className="p-6 text-center">
                      {row.availability.monthly ? (
                        <Check className="w-5 h-5 mx-auto text-green-500" />
                      ) : (
                        <X className="w-5 h-5 mx-auto text-gray-300" />
                      )}
                    </td>
                    <td className="p-6 text-center bg-brand-orange/5">
                      {row.availability.quarterly ? (
                        <Check className="w-5 h-5 mx-auto text-brand-orange" />
                      ) : (
                        <X className="w-5 h-5 mx-auto text-gray-300" />
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {row.availability.annual ? (
                        <Check className="w-5 h-5 mx-auto text-brand-purple" />
                      ) : (
                        <X className="w-5 h-5 mx-auto text-gray-300" />
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50/80">
                  <td className="p-6 font-bold text-brand-dark uppercase tracking-wider text-sm">Total Savings</td>
                  <td className="p-6 text-center font-bold text-gray-400">{pageData.comparisonTable.savings.monthly}</td>
                  <td className="p-6 text-center font-black text-brand-orange bg-brand-orange/10">
                    {pageData.comparisonTable.savings.quarterly}
                  </td>
                  <td className="p-6 text-center font-black text-brand-purple">
                    {pageData.comparisonTable.savings.annual}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
