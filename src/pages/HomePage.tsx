import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroSlider } from '../components/HeroSlider';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import {
  Zap,
  Flame,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Star,
  Sparkles,
  Award,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setCurrentPage, setFilterState, reviews } = useStore();

  const featuredProducts = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);
  
  // Resilient category matches
  const earbuds = products.filter(
    (p) => p.category?.toLowerCase().includes('earbud') || p.category === 'Wireless Earbuds'
  );
  const watches = products.filter(
    (p) => p.category?.toLowerCase().includes('watch') || p.category === 'Smart Watches'
  );
  const powerAndChargers = products.filter(
    (p) =>
      p.category?.toLowerCase().includes('charger') ||
      p.category?.toLowerCase().includes('cable') ||
      p.category?.toLowerCase().includes('power') ||
      p.category === 'Chargers & Cables' ||
      p.category === 'Power Banks'
  );

  // Fallback to show any products if specific flags aren't set
  const displayDeals = featuredProducts.length > 0 ? featuredProducts : products;
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  const navigateToCategory = (categoryName: string) => {
    setFilterState((prev) => ({ ...prev, category: categoryName, searchQuery: '' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. "Our Categories" Grid */}
      <CategoryGrid />

      {/* 3. Featured Products / Flash Deals Section */}
      {displayDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Trending Across Pakistan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                Featured Products & Deals
              </h2>
            </div>
            <button
              onClick={() => {
                setFilterState((prev) => ({ ...prev, category: 'all' }));
                setCurrentPage('shop');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Explore All Deals ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayDeals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Promotional Banner (Pakistan Express Guarantee) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Official Pakistani Guarantee
            </span>
            <h3 className="text-xl sm:text-3xl font-black leading-tight">
              Genuine Gadgets Delivered to Your Doorstep in 2-3 Days
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Order easily with Cash on Delivery (COD) or instant Easypaisa / JazzCash payment. All accessories come with 7-day checking replacement warranty.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, category: 'all' }));
                  setCurrentPage('shop');
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all uppercase tracking-wider"
              >
                Shop Full Catalog
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-3 rounded-xl border border-slate-700 transition-colors"
              >
                Customer Support & Tracking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Category Row: Wireless Earbuds & TWS */}
      {earbuds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Wireless Earbuds & Audio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active noise cancellation, low gaming latency & punchy titanium bass
              </p>
            </div>
            <button
              onClick={() => navigateToCategory('Wireless Earbuds')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              <span>View All Earbuds ({earbuds.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {earbuds.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Category Row: Smart Watches & Fitness */}
      {watches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AMOLED Smart Watches
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                HD Bluetooth Calling, Urdu text notifications & health monitoring
              </p>
            </div>
            <button
              onClick={() => navigateToCategory('Smart Watches')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              <span>View All Watches ({watches.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {watches.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Category Row: Chargers, Cables & Power Banks */}
      {powerAndChargers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Fast Chargers & Power Solutions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                GaN 65W/100W PD adapters, braided cables & 20,000mAh battery packs
              </p>
            </div>
            <button
              onClick={() => navigateToCategory('Chargers & Cables')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              <span>View Power Gear</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {powerAndChargers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Best Sellers & Customer Favorites */}
      {displayBestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                Best Selling Accessories
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayBestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Trusted Across Pakistan</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            What Pakistani Tech Enthusiasts Say
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified buyers in Karachi, Lahore, Islamabad, and nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{rev.userName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{rev.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
