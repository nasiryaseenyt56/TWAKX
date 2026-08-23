import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Latest Smart Gadgets & Audio Gear',
    tagline: 'Mega Clearance Sale in Pakistan',
    description: 'Upgrade your tech setup with flagship ANC earbuds, AMOLED smartwatches, and 65W GaN ultra-fast chargers at unbeatable factory prices.',
    discountBadge: 'UP TO 40% OFF',
    ctaText: 'Shop All Deals',
    categoryTarget: 'all',
    bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-amber-400',
  },
  {
    id: 2,
    title: 'Flagship Wireless Earbuds & TWS',
    tagline: '35dB Hybrid ANC & Studio Bass',
    description: 'Crystal-clear quad mic calls, 40-hour long playback, and ultra-low 38ms gaming latency tuned for PUBG and daily calling.',
    discountBadge: 'BESTSELLER AUDIO',
    ctaText: 'Explore Earbuds',
    categoryTarget: 'Wireless Earbuds',
    bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-cyan-400',
  },
  {
    id: 3,
    title: 'Super AMOLED Calling Smart Watches',
    tagline: '2.04" Always-On HD Display',
    description: 'Direct wrist bluetooth calling, Urdu notification alerts, IP68 water resistance, and 2 interchangeable straps included with every watch.',
    discountBadge: 'NEW ARRIVALS 2026',
    ctaText: 'Discover Smart Watches',
    categoryTarget: 'Smart Watches',
    bgGradient: 'from-slate-950 via-slate-900 to-emerald-950',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&auto=format&fit=crop&q=80',
    accentColor: 'text-emerald-400',
  },
];

export const HeroSlider: React.FC = () => {
  const { setCurrentPage, setFilterState } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleCtaClick = (categoryTarget: string) => {
    setFilterState((prev) => ({ ...prev, category: categoryTarget, searchQuery: '' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative bg-slate-950 overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px] sm:min-h-[420px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left z-10">
            {/* Promo Tag */}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-full px-3 py-1 text-xs">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {slide.discountBadge}
              </span>
              <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
                {slide.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {slide.title}
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>2-3 Days Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>1 Year Official Warranty</span>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id={`hero-cta-btn-${slide.id}`}
                onClick={() => handleCtaClick(slide.categoryTarget)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, onSaleOnly: true }));
                  setCurrentPage('shop');
                }}
                className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition-all"
              >
                View On-Sale Items
              </button>
            </div>
          </div>

          {/* Right Visual Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>

            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              {/* Floating Product Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs text-white">
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase">
                    100% Genuine TWAKX Accessories
                  </div>
                  <div className="font-bold text-white text-xs truncate">
                    Cash on Delivery Available Across Pakistan
                  </div>
                </div>
                <div className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg uppercase">
                  VERIFIED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx
                    ? 'w-8 bg-amber-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
