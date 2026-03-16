import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 pb-24">
            {/* Header section (Reduced Height) */}
            <div className="bg-brand-dark py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-purple opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">MEMBERSHIP PLANS</h1>
                    <p className="text-lg md:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
                        Simple Plans. Complete Clarity.
                    </p>
                    <p className="text-brand-orange mt-2 font-bold tracking-wide text-sm md:text-base uppercase bg-brand-orange/10 px-4 py-1 rounded-full">
                        No hidden fees. No long-term pressure. Cancel anytime.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-16">

                {/* Pricing Cards (3 equal width, equal height) */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">

                    {/* Monthly */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative z-10">
                        <h3 className="text-lg font-black text-brand-dark mb-2 tracking-tight">MONTHLY</h3>
                        <p className="text-gray-500 mb-6 font-medium text-sm">No commitment. Pause anytime.</p>

                        <div className="mb-2">
                            <span className="text-lg font-bold text-gray-400 align-top mr-1">₹</span>
                            <span className="text-4xl lg:text-5xl font-black text-brand-purple tracking-tight">3,000</span>
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 h-6 invisible">
                            Spacer
                        </div>

                        <ul className="space-y-5 text-base font-medium text-gray-700 mb-10 flex-grow">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Full Gym Access</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Free InBody Scan</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Free Steam Bath</li>
                        </ul>

                        <button onClick={() => navigate('/contact')} className="w-full py-4 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-brand-dark hover:text-white transition-all hover:shadow-lg mt-auto">
                            Get Started
                        </button>
                    </div>

                    {/* Quarterly (Featured) */}
                    <div className="bg-brand-dark p-8 md:p-10 rounded-[2rem] border-2 border-brand-orange shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative z-20 md:-mt-4 md:mb-4">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">
                            Most Popular Choice
                        </div>

                        <h3 className="text-lg font-black text-white mb-2 tracking-tight">QUARTERLY</h3>
                        <p className="text-gray-400 mb-6 font-medium text-sm">3-month plan. Best balance.</p>

                        <div className="mb-2">
                            <span className="text-lg font-bold text-gray-400 align-top mr-1">₹</span>
                            <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">7,500</span>
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                            ₹2,500 / month equivalent
                        </div>
                        <div className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-8 max-w-max border border-brand-orange/30">
                            You save ₹1,500
                        </div>

                        <ul className="space-y-5 text-base font-medium text-gray-300 mb-10 flex-grow">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Full Gym Access</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> All Group Classes</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Free InBody Scan</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" /> Free Steam Bath</li>
                        </ul>

                        <button onClick={() => navigate('/contact')} className="w-full py-4 bg-brand-orange text-white font-black uppercase tracking-widest rounded-xl hover:bg-brand-orange-hover transition-all shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 mt-auto">
                            Get Started
                        </button>
                    </div>

                    {/* Annual */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative z-10">
                        <h3 className="text-lg font-black text-brand-dark mb-2 tracking-tight">ANNUAL</h3>
                        <p className="text-gray-500 mb-6 font-medium text-sm">12-month plan. Maximum gains.</p>

                        <div className="mb-2">
                            <span className="text-lg font-bold text-gray-400 align-top mr-1">₹</span>
                            <span className="text-4xl lg:text-5xl font-black text-brand-purple tracking-tight">25,000</span>
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                            ₹2,083 / month equivalent
                        </div>
                        <div className="inline-block bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-8 max-w-max border border-brand-purple/20">
                            You save ₹11,000
                        </div>

                        <ul className="space-y-5 text-base font-medium text-gray-700 mb-10 flex-grow">
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Full Gym Access</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> All Group Classes</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Free InBody Scan</li>
                            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" /> Free Steam Bath</li>
                        </ul>

                        <button onClick={() => navigate('/contact')} className="w-full py-4 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-widest rounded-xl hover:bg-brand-dark hover:text-white transition-all hover:shadow-lg mt-auto">
                            Get Started
                        </button>
                    </div>

                </div>

                {/* Comparison Table */}
                <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-2xl font-black text-brand-dark text-center tracking-tight">COMPARE FEATURE PLANS</h3>
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
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">Full Gym Access</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-green-500" /></td>
                                    <td className="p-6 text-center bg-brand-orange/5"><Check className="w-5 h-5 mx-auto text-brand-orange" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-brand-purple" /></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">Free InBody Scan</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-green-500" /></td>
                                    <td className="p-6 text-center bg-brand-orange/5"><Check className="w-5 h-5 mx-auto text-brand-orange" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-brand-purple" /></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">Free Steam Bath</td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-green-500" /></td>
                                    <td className="p-6 text-center bg-brand-orange/5"><Check className="w-5 h-5 mx-auto text-brand-orange" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-brand-purple" /></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6">All Group Classes (Yoga, Zumba, HIIT)</td>
                                    <td className="p-6 text-center"><X className="w-5 h-5 mx-auto text-gray-300" /></td>
                                    <td className="p-6 text-center bg-brand-orange/5"><Check className="w-5 h-5 mx-auto text-brand-orange" /></td>
                                    <td className="p-6 text-center"><Check className="w-5 h-5 mx-auto text-brand-purple" /></td>
                                </tr>
                                <tr className="bg-gray-50/80">
                                    <td className="p-6 font-bold text-brand-dark uppercase tracking-wider text-sm">Total Savings</td>
                                    <td className="p-6 text-center font-bold text-gray-400">-</td>
                                    <td className="p-6 text-center font-black text-brand-orange bg-brand-orange/10">₹1,500</td>
                                    <td className="p-6 text-center font-black text-brand-purple">₹11,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
