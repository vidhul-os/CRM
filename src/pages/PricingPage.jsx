import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Rocket, Zap, Heart } from 'lucide-react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const PricingPage = () => {
  const navigate = useNavigate();
  const setSelectedPlan = useSubscriptionStore((state) => state.setSelectedPlan);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 100,
      description: 'Perfect for small teams getting started.',
      icon: Zap,
      color: 'indigo',
      features: [
        'Up to 500 CRM contacts',
        'Email support',
        'Basic analytics dashboard',
        '1 user seat',
        'Monthly reports',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: 150,
      description: 'Ideal for growing businesses needing more power.',
      icon: Rocket,
      color: 'violet',
      featured: true,
      features: [
        'Up to 2000 CRM contacts',
        'Priority email & chat support',
        'Advanced analytics',
        '3 user seats',
        'Weekly reports',
        'API access',
      ],
    },
  ];

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 italic">
            Simple, Transparent <span className="text-indigo-600">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-8 rounded-[40px] border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                plan.featured 
                  ? 'border-indigo-600 shadow-2xl shadow-indigo-200' 
                  : 'border-gray-100 shadow-xl hover:border-indigo-200'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-100 flex items-center justify-center text-${plan.color}-600 mb-6`}>
                    <plan.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500 font-medium">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full bg-${plan.color}-50 flex items-center justify-center text-${plan.color}-600`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleChoosePlan(plan)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                    plan.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                      : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Preview / Trust Banner */}
        <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                <Heart className="text-rose-500 fill-rose-500" size={18} />
                <span className="text-gray-600 font-bold">Trusted by 500+ businesses worldwide</span>
            </div>
        </div>
      </main>

      <Footer />

      {/* Dynamic colors for tailwind if needed */}
      <div className="hidden bg-indigo-100 bg-violet-100 text-indigo-600 text-violet-600 bg-indigo-50 bg-violet-50" />
    </div>
  );
};

export default PricingPage;
