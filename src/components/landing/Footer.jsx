import React from 'react';
import { 
    Twitter, 
    Linkedin, 
    Facebook, 
    Instagram, 
    Mail, 
    Phone, 
    MapPin, 
    Rocket,
    Send 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 pt-20 pb-10 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-white bg-clip-text text-transparent opacity-90">
                NexusCRM
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-gray-400">
              NexusCRM is the leading platform for smarter business management. Helping you grow 10x faster with data-driven insights.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4">
              {['Home', 'Features', 'Pricing', 'About Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start group">
                <div className="w-10 h-10 min-w-[40px] rounded-lg bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Email</p>
                  <p className="text-sm text-gray-300">hello@nexus-crm.com</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="w-10 h-10 min-w-[40px] rounded-lg bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Phone</p>
                  <p className="text-sm text-gray-300">+1 (555) 000-1234</p>
                </div>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="w-10 h-10 min-w-[40px] rounded-lg bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Location</p>
                  <p className="text-sm text-gray-300 leading-relaxed">123 Tech Avenue, Suite 100, <br />San Francisco, CA 94103</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-indigo-600 px-6 py-8 rounded-[32px] relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 text-white space-y-4">
              <h4 className="font-bold text-xl leading-snug">Subscribe to Our Newsletter</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Stay updated with the latest news and features from NexusCRM.
              </p>
              <div className="relative mt-4">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/40"
                />
                <button className="absolute right-1 text-indigo-600 bg-white p-2 rounded-lg hover:scale-105 active:scale-95 transition-all top-[5px]">
                  <Send size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} NexusCRM. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
