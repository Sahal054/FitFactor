import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo';
import { mockContactPageData, mockPricingPageData } from '../data/mockdata';
import { api, USE_MOCK_API } from '../services/api';

export default function Contact({ siteSettings }) {
  const [pageData, setPageData] = useState(USE_MOCK_API ? mockContactPageData : null);
  const [pricingData, setPricingData] = useState(USE_MOCK_API ? mockPricingPageData : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [searchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('plan')?.trim().toLowerCase() || '';

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([api.getContactPageData(), api.getPricingPageData()]).then((results) => {
      if (!isMounted) {
        return;
      }

      const [contactResult, pricingResult] = results;

      if (contactResult.status === 'fulfilled') {
        setPageData(contactResult.value);
      } else {
        console.error('Failed to load contact page data.', contactResult.reason);
      }

      if (pricingResult.status === 'fulfilled') {
        setPricingData(pricingResult.value);
      } else {
        console.error('Failed to load pricing data for the contact page.', pricingResult.reason);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPlan = useMemo(() => {
    if (!pricingData || !selectedPlanId) {
      return null;
    }

    return pricingData.plans.find((plan) => plan.id === selectedPlanId) || null;
  }, [pricingData, selectedPlanId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName')?.toString().trim(),
      phoneNumber: formData.get('phoneNumber')?.toString().trim(),
      primaryGoal: formData.get('primaryGoal')?.toString(),
      message: formData.get('message')?.toString().trim() || '',
      source: selectedPlan ? `contact-page-${selectedPlan.id}` : 'contact-page',
      selectedPlanId: selectedPlan?.id || '',
      selectedPlanName: selectedPlan?.name || '',
      selectedPlanPrice: selectedPlan ? `${selectedPlan.currency} ${selectedPlan.price}` : '',
      selectedPlanSavings: selectedPlan?.savings || '',
    };

    try {
      setIsSubmitting(true);
      await api.submitConsultationRequest(payload);
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit consultation request.', error);
      setSubmissionError('We could not send your request right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pageData) {
    return (
      <section className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Loading contact page...</p>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={pageData.header.title}
        description={pageData.header.subtitle}
        path="/contact"
      />

      <div className="bg-gray-50 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tight uppercase">
            {pageData.header.title}
          </h1>
          <p className="text-lg md:text-lg font-medium text-brand-orange">{pageData.header.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-12">
              <h3 className="text-2xl font-black text-brand-dark mb-8 tracking-tight">{pageData.infoPanel.title}</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-brand-purple flex items-center justify-center rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">{pageData.infoPanel.visitLabel}</h4>
                    <p className="text-gray-500 font-sans font-medium text-sm md:text-base leading-relaxed">
                      {siteSettings.contact.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 text-brand-purple flex items-center justify-center rounded-2xl group-hover:-translate-y-1 group-hover:shadow-md transition-all shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-brand-dark mb-1">{pageData.infoPanel.callLabel}</h4>
                    <p className="text-gray-500 font-sans font-medium text-sm md:text-base leading-relaxed">
                      {siteSettings.contact.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border border-gray-100 rounded-[2rem] shadow-sm">
              <h4 className="font-bold text-lg text-brand-dark mb-6">{pageData.consultationBenefits.title}</h4>
              <ul className="space-y-4 font-sans text-gray-600 font-medium">
                {pageData.consultationBenefits.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 lg:p-14 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

              {isSubmitted ? (
                <div className="text-center relative z-10 py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-4">{pageData.form.successTitle}</h3>
                  <p className="text-gray-600 font-medium text-lg mb-10 max-w-sm mx-auto">
                    {pageData.form.successMessage}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="py-4 px-8 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-brand-dark hover:text-white transition-all hover:shadow-lg"
                  >
                    {pageData.form.successResetLabel}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10">
                  {selectedPlan && (
                    <div className="mb-8 p-5 rounded-[1.75rem] border border-brand-purple/15 bg-brand-purple/5">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                        <div>
                          <p className="text-xs font-bold text-brand-purple uppercase tracking-[0.2em] mb-2">
                            Selected Membership
                          </p>
                          <h4 className="text-2xl font-black text-brand-dark tracking-tight">
                            {selectedPlan.name} Plan
                          </h4>
                          <p className="text-sm text-gray-600 font-medium mt-2 max-w-md">
                            This membership selection will be included in your request so the team can honor the
                            discounted rate you chose.
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                            Starting Price
                          </p>
                          <p className="text-3xl font-black text-brand-dark tracking-tight">
                            {selectedPlan.currency} {selectedPlan.price}
                          </p>
                          {selectedPlan.monthlyEquivalent && (
                            <p className="text-sm font-bold text-gray-500 mt-1">{selectedPlan.monthlyEquivalent}</p>
                          )}
                        </div>
                      </div>

                      {selectedPlan.savings && (
                        <div className="mt-4 inline-flex items-center rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-brand-orange">
                          {selectedPlan.savings}
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-2xl font-black text-brand-dark mb-8 tracking-tight">{pageData.form.title}</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all"
                          placeholder={pageData.form.placeholders.fullName}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          title="Please enter a valid 10-digit phone number"
                          className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all"
                          placeholder={pageData.form.placeholders.phoneNumber}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Primary Goal</label>
                      <select
                        name="primaryGoal"
                        required
                        defaultValue=""
                        className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all text-brand-dark appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your target...
                        </option>
                        {siteSettings.consultationGoals.map((goal) => (
                          <option key={goal.value} value={goal.value}>
                            {goal.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Message (Optional)</label>
                      <textarea
                        name="message"
                        className="w-full p-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 focus:bg-white hover:bg-white transition-all resize-y min-h-[120px]"
                        placeholder={pageData.form.placeholders.message}
                      ></textarea>
                    </div>

                    {submissionError && <p className="text-sm font-medium text-red-500">{submissionError}</p>}

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-brand-purple text-white text-lg font-black uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-purple/20 hover:shadow-brand-dark/30 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isSubmitting ? 'Sending...' : pageData.form.submitLabel}
                      </button>
                      <p className="text-center text-sm font-medium text-gray-400 mt-4">{pageData.form.submitNote}</p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
