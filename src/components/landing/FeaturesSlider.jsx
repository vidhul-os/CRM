import React, { useRef } from 'react';
import { 
    Users, 
    TrendingUp, 
    Headphones, 
    Package, 
    BarChart3, 
    ChevronLeft, 
    ChevronRight,
    ArrowRight
} from 'lucide-react';

const FeaturesSlider = () => {
    const scrollRef = useRef(null);

    const modules = [
        {
            title: 'Leads Management',
            description: 'Track and qualify every lead to shorten your sales cycle and win more deals.',
            icon: Users,
            color: 'bg-blue-500',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'Sales Pipeline',
            description: 'Visualize your entire sales funnel and manage opportunities through custom stages.',
            icon: TrendingUp,
            color: 'bg-indigo-500',
            gradient: 'from-indigo-500 to-violet-500',
        },
        {
            title: 'Customer Support',
            description: 'Delight customers with multi-channel support and a unified workspace for tickets.',
            icon: Headphones,
            color: 'bg-emerald-500',
            gradient: 'from-emerald-500 to-green-500',
        },
        {
            title: 'Inventory Control',
            description: 'Manage products, stock levels, and warehouse operations across multiple locations.',
            icon: Package,
            color: 'bg-amber-500',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            title: 'Reports & Analytics',
            description: 'Gain deep insights into your business performance with real-time dashboards and reports.',
            icon: BarChart3,
            color: 'bg-rose-500',
            gradient: 'from-rose-500 to-pink-500',
        },
    ];

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="features" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                            Platform Features
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Powerful Modules to Drive Your Business Success
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
                        >
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
                        >
                            <ChevronRight size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 px-[calc((100vw-min(1280px,calc(100vw-64px)))/2)] scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {modules.map((module, index) => (
                    <div 
                        key={index}
                        className="min-w-[320px] md:min-w-[380px] group bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col gap-6 snap-start"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white shadow-lg shadow-${module.color}/20 group-hover:scale-110 transition-transform duration-500`}>
                            <module.icon size={32} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {module.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {module.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-6 border-t border-gray-50">
                            <button className="flex items-center gap-2 font-bold text-indigo-600 hover:gap-4 transition-all uppercase text-xs tracking-widest">
                                Explore Module <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default FeaturesSlider;
