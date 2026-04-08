import React, { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import FeaturesSlider from '@/components/landing/FeaturesSlider';
import About from '@/components/landing/About';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  useEffect(() => {
    // Basic Intersection Observer for revealing elements on scroll
    const observerOptions = {
      threshold: 0.1,
    };

    const revealCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    const hiddenElements = document.querySelectorAll('.reveal-hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {/* Navbar Container */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* Sections can be wrapped with reveal-hidden for standard scroll-reveal behavior if desired */}
        <Hero />
        
        <div className="reveal-hidden opacity-0 translate-y-20 transition-all duration-1000 ease-out">
            <FeaturesSlider />
        </div>

        <div className="reveal-hidden opacity-0 translate-y-20 transition-all duration-1000 ease-out">
            <About />
        </div>
      </main>

      {/* Footer Container */}
      <Footer />

      {/* Scroll Reveal Styles */}
      <style>{`
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Smooth Scroll is already handled by Navbar script, but global CSS for backup */
        html {
          scroll-behavior: smooth;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Custom selection color */
        ::selection {
          background: #e0e7ff;
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
