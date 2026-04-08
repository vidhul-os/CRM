import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Play ,CheckCircle,Smartphone} from 'lucide-react'

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section id="home" className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -z-10 bg-gradient-to-br from-indigo-50 to-violet-50 w-full lg:w-[45%] h-full rounded-bl-[120px] transition-all" />
            <div className="absolute -top-24 -right-24 bg-indigo-600/10 w-64 h-64 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-[40%] -left-20 bg-violet-600/10 w-80 h-80 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Hero Left Content */}
                    <div className="flex flex-col gap-8 opacity-0 animate-fade-in-up">
                        <div className="flex flex-col gap-4">
                            <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold max-w-fit shadow-sm">
                                <Zap size={16} />
                                New Version 2.0 Released
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
                                Manage Your Business <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">
                                    Smarter
                                </span> with CRM
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                Boost productivity and accelerate sales with our all-in-one CRM platform. Designed for teams to scale without the complexity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => navigate('/pricing')}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                            >
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-3 px-8 py-4 text-gray-700 font-bold hover:text-indigo-600 transition-colors border border-gray-200 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/50"
                            >
                                <Play className="w-5 h-5 fill-current" /> Learn More
                            </button>
                        </div>


                        {/* Social Proof */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white overflow-hidden ring-2 ring-transparent hover:ring-indigo-300 transition-all cursor-pointer">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600">
                                    +5K
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 leading-none">5,000+ Users</span>
                                <span className="text-xs text-gray-500 font-medium tracking-wide">TRUSTED WORLDWIDE</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Right Content */}
                    <div className="relative opacity-0 animate-fade-in-right transform scale-95 hover:scale-100 transition-transform duration-700 ease-out">
                        <div className="relative z-10 p-6 backdrop-blur-[2px] rounded-3xl border border-white/50 shadow-2xl overflow-hidden bg-white/10 group">
                            {/* CRM Dashboard Mockup Simulation */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-indigo-500/10">
                                <div className="h-8 bg-gray-50/80 border-b border-gray-100 flex items-center px-4 gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <div className="h-3 w-28 bg-gray-200 rounded-full animate-pulse" />
                                            <div className="h-2 w-16 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100" />
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-100 transition-colors">
                                                <div className={`w-8 h-8 rounded-lg mb-3 ${i===1 ? 'bg-indigo-100' : 'bg-gray-100'}`} />
                                                <div className="h-2 w-full bg-gray-100 rounded-full mb-2" />
                                                <div className="h-2 w-2/3 bg-gray-50 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-32 w-full bg-indigo-50/30 border border-indigo-100/50 rounded-xl relative overflow-hidden group">
                                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex gap-1 items-end h-16">
                                                {[50, 70, 40, 90, 60, 80, 50, 75].map((h, i) => (
                                                    <div key={i} style={{ height: `${h}%` }} className="w-2.5 bg-indigo-500 rounded-t-sm animate-grow-up" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating elements */}
                            <div className="absolute -top-6 -right-6 lg:-right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Conversion</p>
                                    <p className="text-lg font-bold text-gray-900">+24%</p>
                                </div>
                            </div>
                            <div className="absolute bottom-10 -left-6 lg:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float delay-1000">
                                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Deals</p>
                                    <p className="text-lg font-bold text-gray-900">$128k</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes grow-up {
                    from { transform: scaleY(0); transform-origin: bottom; }
                    to { transform: scaleY(1); transform-origin: bottom; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
                .animate-fade-in-right { animation: fade-in-right 1s ease-out 0.2s forwards; }
                .animate-grow-up { animation: grow-up 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-float { animation: float 5s ease-in-out infinite; }
            `}</style>
        </section>
    );
};

export default Hero;
