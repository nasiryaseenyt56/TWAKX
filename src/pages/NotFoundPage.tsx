import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Home,
  ShoppingBag,
  ArrowLeft,
  Compass,
  Headphones,
  Watch,
  Zap,
  Truck,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentPage, setFilterState, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setFilterState((prev) => ({ ...prev, searchQuery: searchQuery.trim(), category: 'all' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryName: string) => {
    setFilterState((prev) => ({ ...prev, category: categoryName, searchQuery: '' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center space-y-8">
      {/* 404 Hero Visual Badge */}
      <div className="relative inline-block">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm animate-bounce duration-1000">
          <Compass className="w-12 h-12 sm:w-14 sm:h-14 text-indigo-600" />
        </div>
        <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-mono font-black text-xs px-2.5 py-1 rounded-full border border-amber-300 shadow-md">
          404 ERROR
        </span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3 max-w-lg mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The accessory link or page you are looking for might have been moved, renamed, or is temporarily unavailable in the store.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search earbuds, watches, chargers..."
              className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-colors shadow-xs shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors shadow-md"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2 transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span>Explore All Products</span>
        </button>

        <button
          onClick={() => {
            setCurrentPage('account');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 transition-colors"
        >
          <Truck className="w-4 h-4 text-slate-600" />
          <span>Track Order</span>
        </button>
      </div>

      {/* Popular Categories Shortcut Cards */}
      <div className="pt-6 border-t border-slate-200/80">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Popular Product Categories
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs">
          <button
            onClick={() => handleCategoryClick('Wireless Earbuds')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all text-left flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Earbuds</span>
              <span className="text-[10px] text-slate-400">TWS & Gaming</span>
            </div>
          </button>

          <button
            onClick={() => handleCategoryClick('Smart Watches')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all text-left flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Watch className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Smartwatches</span>
              <span className="text-[10px] text-slate-400">AMOLED & BT</span>
            </div>
          </button>

          <button
            onClick={() => handleCategoryClick('Chargers & Cables')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all text-left flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Chargers</span>
              <span className="text-[10px] text-slate-400">GaN Fast 65W</span>
            </div>
          </button>

          <button
            onClick={() => handleCategoryClick('Power Banks')}
            className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all text-left flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">Power Banks</span>
              <span className="text-[10px] text-slate-400">20,000mAh PD</span>
            </div>
          </button>
        </div>
      </div>

      {/* Need Help Box */}
      <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl p-5 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">Need assistance?</span>
            <span className="text-[11px] text-slate-400">WhatsApp support 24/7</span>
          </div>
        </div>
        <a
          href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=Assalam-o-Alaikum%20TWAKX,%20I%20need%20help%20finding%20a%20product`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
