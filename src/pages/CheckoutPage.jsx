import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { 
    CreditCard, 
    User, 
    Mail, 
    Phone, 
    Building2, 
    MapPin, 
    ArrowLeft, 
    ShieldCheck, 
    Lock,
    CheckCircle2
} from 'lucide-react';

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const selectedPlan = useSubscriptionStore((state) => state.selectedPlan);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        businessName: '',
        businessType: 'Retail',
        address: '',
        city: '',
        pincode: '',
        password: '',
    });

    useEffect(() => {
        if (!selectedPlan) {
            navigate('/pricing');
        }
    }, [selectedPlan, navigate]);

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.mobile || !formData.address || !formData.city || !formData.pincode || !formData.password) {
            alert('Please fill all required fields');
            return;
        }

        if (formData.mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);

        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Check your internet connection.');
                setLoading(false);
                return;
            }

            // 1. Create Order in Backend
            const orderRes = await api.post('/payment/create-order', {
                amount: selectedPlan.price,
                planName: selectedPlan.name
            });

            if (!orderRes.data.success) {
                throw new Error(orderRes.data.message || 'Order creation failed');
            }

            const { orderId, amount, currency, keyId } = orderRes.data;

            // 2. Open Razorpay Widget
            const options = {
                key: keyId,
                amount,
                currency,
                name: 'NexusCRM',
                description: `Payment for ${selectedPlan.name}`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        // 3. Verify Payment and Onboard User
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userDetails: formData,
                            planDetails: selectedPlan
                        });


                        if (verifyRes.data.success) {
                            navigate('/success', { 
                                state: { 
                                    subscriptionId: verifyRes.data.subscriptionId,
                                    startDate: verifyRes.data.startDate,
                                    endDate: verifyRes.data.endDate,
                                    amount: selectedPlan.price,
                                    planName: selectedPlan.name
                                } 
                            });
                        } else {
                            alert('Verification failed: ' + verifyRes.data.message);
                        }
                    } catch (error) {
                        console.error('Verification Error:', error);
                        alert('Error verifying payment: ' + (error.response?.data?.message || error.message));
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.mobile
                },
                notes: {
                    address: formData.address
                },
                theme: {
                    color: '#4f46e5'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Payment Flow Error:', error);
            alert('Payment failed to initiate: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPlan) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate('/pricing')}
                    className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-bold mb-8 group"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to Pricing
                </button>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                                <User className="text-indigo-600" size={32} />
                                Business & User Details
                            </h2>

                            <form onSubmit={handlePayment} className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="name" required value={formData.name} onChange={handleInputChange}
                                            type="text" placeholder="John Doe" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="email" required value={formData.email} onChange={handleInputChange}
                                            type="email" placeholder="john@example.com" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="mobile" required value={formData.mobile} onChange={handleInputChange}
                                            type="tel" placeholder="9876543210" maxLength="10"
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Business Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="businessName" value={formData.businessName} onChange={handleInputChange}
                                            type="text" placeholder="Acme Corp" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Business Type</label>
                                    <select 
                                        name="businessType" value={formData.businessType} onChange={handleInputChange}
                                        className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none appearance-none"
                                    >
                                        <option value="Retail">Retail</option>
                                        <option value="Service">Service</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="E-commerce">E-commerce</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="city" required value={formData.city} onChange={handleInputChange}
                                            type="text" placeholder="London" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Address</label>
                                    <input 
                                        name="address" required value={formData.address} onChange={handleInputChange}
                                        type="text" placeholder="123 Street, Lane 4" 
                                        className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Pincode</label>
                                    <input 
                                        name="pincode" required value={formData.pincode} onChange={handleInputChange}
                                        type="text" placeholder="123456" 
                                        className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">Login Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            name="password" required value={formData.password} onChange={handleInputChange}
                                            type="password" placeholder="••••••••" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-indigo-600 p-8 rounded-[40px] text-white sticky top-32 shadow-2xl shadow-indigo-200">
                            <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
                            
                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <div>
                                        <p className="font-bold text-lg">{selectedPlan.name}</p>
                                        <p className="text-indigo-100 text-sm">Valid for 1 year</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <CreditCard size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-bold text-indigo-100 uppercase tracking-widest">Plan Highlights</p>
                                    {selectedPlan.features.slice(0, 3).map((f, i) => (
                                        <div key={i} className="flex item-start gap-3 text-sm">
                                            <CheckCircle2 size={16} className="text-indigo-300 mt-0.5" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/20 pt-8 space-y-4">
                                <div className="flex justify-between text-lg">
                                    <span className="text-indigo-100">Plan Amount</span>
                                    <span className="font-bold">₹{selectedPlan.price}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-extrabold items-end">
                                    <span>Total Pay</span>
                                    <span>₹{selectedPlan.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className={`w-full mt-10 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group active:scale-95 ${
                                    loading 
                                        ? 'bg-indigo-400 cursor-not-allowed' 
                                        : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Proceed to Pay'}
                                <ArrowLeft className="rotate-180 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4 text-xs text-indigo-100">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-indigo-300" />
                                    <span>Secure checkout via Razorpay</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock size={14} className="text-indigo-300" />
                                    <span>256-bit SSL encrypted connection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
