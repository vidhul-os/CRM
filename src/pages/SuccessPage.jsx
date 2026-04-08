import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, CreditCard, Rocket, ArrowRight, Share2, Download } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

const SuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const clearSelectedPlan = useSubscriptionStore((state) => state.clearSelectedPlan);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/pricing');
            return;
        }
        setDetails(location.state);
        clearSelectedPlan();
    }, [location.state, navigate, clearSelectedPlan]);

    if (!details) return null;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Success Hero */}
                    <div className="text-center mb-16 relative">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 animate-bounce-short border-4 border-green-50">
                            <CheckCircle2 size={48} strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Payment <span className="text-green-600 italic">Successful!</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
                            Congratulations! Your NexusCRM account is now active and ready to scale your business.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-gray-50 p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                        {/* Decorative background logo */}
                        <div className="absolute top-0 right-0 p-8 text-black/5 group-hover:text-black/10 transition-colors">
                            <Rocket size={160} className="-mr-12 -mt-12 transform rotate-12" />
                        </div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected Plan</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Rocket size={20} />
                                        </div>
                                        <span className="text-2xl font-extrabold text-gray-900">{details.planName}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount Paid</p>
                                    <div className="flex items-center gap-3 text-gray-900">
                                        <CreditCard size={20} className="text-indigo-600" />
                                        <span className="text-2xl font-extrabold">₹{details.amount}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all">
                                        <Download size={18} /> Download Receipt
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Start Date</p>
                                                <p className="font-bold text-gray-900">{new Date(details.startDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-gray-50" />
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-gray-400 group-hover:text-red-500 transition-colors" size={20} />
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Valid Until</p>
                                                <p className="font-bold text-gray-900">{new Date(details.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3">
                                    <CheckCircle2 size={18} className="text-indigo-600" />
                                    <p className="text-xs text-indigo-700 font-medium">Auto-renewal active for next billing cycle.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button 
                            onClick={() => navigate('/crm/dashboard')}
                            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200"
                        >
                            Go to Dashboard <ArrowRight size={20} />
                        </button>
                        <button className="flex items-center gap-3 px-10 py-5 text-gray-600 font-bold hover:text-indigo-600 transition-colors border border-gray-200 rounded-2xl hover:bg-gray-50/50 active:scale-95">
                            <Share2 size={20} /> Share Experience
                        </button>
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-sm text-gray-400 font-medium">
                            An activation email has been sent to your registered address. <br />
                            Subscription ID: <code className="bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{details.subscriptionId}</code>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default SuccessPage;
