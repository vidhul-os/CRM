import React from 'react';
import { Target, Shield, Heart, Globe, Users, Trophy } from 'lucide-react';

const About = () => {
    const values = [
      { icon: Target, title: 'Precision', desc: 'Accurate data at your fingertips for smarter decision making.' },
      { icon: Shield, title: 'Security', desc: 'Enterprise-grade protection for your sensitive customer information.' },
      { icon: Heart, title: 'Customer First', desc: 'Focus on building lasting relationships, not just closing sales.' },
      { icon: Globe, title: 'Accessibility', desc: 'Access your CRM from anywhere, on any device, at any time.' },
    ];

    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* About Content */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm bg-indigo-50 px-3 py-1 rounded">
                                Our Mission
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                Empowering Companies to Scale Through Relationships
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                NexusCRM was born from a simple idea: that every interaction is an opportunity. Our mission is to provide the world's most intuitive and effective tools for businesses of all sizes to manage their entire ecosystem in one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {values.map((v, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 min-w-[48px] rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                        <v.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 text-lg">{v.title}</h4>
                                        <p className="text-gray-500 text-sm">{v.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-12 pt-6">
                            <div className="text-center">
                                <p className="text-4xl font-extrabold text-indigo-600 mb-1">98%</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Satisfaction</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                            <div className="text-center">
                                <p className="text-4xl font-extrabold text-indigo-600 mb-1">10X</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Team Speed</p>
                            </div>
                            <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                            <div className="text-center">
                                <p className="text-4xl font-extrabold text-indigo-600 mb-1">500+</p>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Companies</p>
                            </div>
                        </div>
                    </div>

                    {/* About Image / Illustration Section */}
                    <div className="relative group">
                        <div className="aspect-square bg-gradient-to-br from-indigo-100/50 to-violet-100/50 rounded-[64px] relative overflow-hidden flex items-center justify-center border-2 border-indigo-50/50">
                            {/* Decorative bubbles or patterns */}
                            <div className="absolute top-20 right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-20 left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-700" />
                            
                            {/* Abstract Image Placeholder with Icons */}
                            <div className="relative z-10 grid grid-cols-2 gap-6 p-12">
                                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform -rotate-3 transition-transform group-hover:rotate-0 duration-500">
                                    <Users className="text-indigo-600 w-12 h-12 mb-4" />
                                    <div className="h-2 w-16 bg-gray-200 rounded-full mb-2" />
                                    <div className="h-2 w-10 bg-gray-100 rounded-full" />
                                </div>
                                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform rotate-6 transition-transform group-hover:rotate-0 duration-500 mt-12">
                                    <Trophy className="text-amber-500 w-12 h-12 mb-4" />
                                    <div className="h-2 w-16 bg-gray-200 rounded-full mb-2" />
                                    <div className="h-2 w-10 bg-gray-100 rounded-full" />
                                </div>
                                <div className="col-span-2 bg-indigo-600 px-8 py-6 rounded-3xl shadow-2xl text-white transform -translate-y-4 transition-transform group-hover:translate-y-0 duration-500">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20" />
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-white/30 rounded-full mb-2" />
                                            <div className="h-2 w-16 bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg">Active Since 2021</p>
                                    <p className="text-indigo-100 text-sm">Trusted by 10k users</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating elements attached to corners */}
                        <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-float border border-gray-100">
                          <CheckCircle className="text-green-500 w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-float delay-1000 border border-gray-100">
                          <span className="font-bold text-indigo-600">Premium Choice</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float { animation: float 4s ease-in-out infinite; }
            `}</style>
        </section>
    );
};

const CheckCircle = ({ className, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default About;
