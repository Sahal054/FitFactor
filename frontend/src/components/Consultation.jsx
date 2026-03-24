import { useState } from 'react';
import { Award, Calendar, CheckCircle2, Users } from 'lucide-react';
import { api } from '../services/api';

const trustIcons = {
  calendar: Calendar,
  users: Users,
  award: Award,
};

export default function Consultation({ content, consultationGoals }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get('fullName')?.toString().trim(),
      phoneNumber: formData.get('phoneNumber')?.toString().trim(),
      primaryGoal: formData.get('primaryGoal')?.toString(),
      source: 'home-consultation',
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

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white p-8 md:p-14 lg:p-16 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

          {isSubmitted ? (
            <div className="text-center relative z-10 py-12">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">{content.successTitle}</h3>
              <p className="text-gray-600 font-medium text-lg mb-10 max-w-xl mx-auto">{content.successMessage}</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="py-4 px-8 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-brand-dark hover:text-white transition-all hover:shadow-lg"
              >
                {content.successResetLabel}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-4 tracking-tight leading-[1.1]">
                  {content.title} <span className="text-brand-purple">{content.highlight}</span> {content.suffix}
                </h2>
                <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">{content.description}</p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="text-left">
                    <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Your Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white"
                      placeholder="9876543210"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                      required
                    />
                  </div>
                </div>

                <div className="mb-8 text-left">
                  <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide uppercase">Main Goal</label>
                  <select
                    name="primaryGoal"
                    defaultValue=""
                    required
                    className="w-full p-5 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all bg-gray-50/50 hover:bg-white text-brand-dark cursor-pointer appearance-none"
                  >
                    <option value="" disabled>
                      Select your primary objective...
                    </option>
                    {consultationGoals.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                {submissionError && <p className="mb-6 text-sm font-medium text-red-500">{submissionError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-brand-orange text-white text-lg font-black uppercase tracking-wider rounded-xl hover:bg-brand-orange-hover transition-all shadow-xl shadow-brand-orange/20 transform hover:-translate-y-1 hover:shadow-brand-orange/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Sending...' : content.submitLabel}
                </button>

                <p className="text-center text-sm text-gray-500 mt-5 font-medium">{content.submitNote}</p>
              </form>
            </>
          )}

          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm font-bold text-gray-400 uppercase tracking-widest relative z-10">
            {content.trustIndicators.map((indicator) => {
              const Icon = trustIcons[indicator.iconKey];

              return (
                <div key={indicator.label} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-brand-purple/50" />
                  <span>{indicator.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
