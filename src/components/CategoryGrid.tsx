import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { setCurrentPage, setFilterState, products, categories } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setFilterState((prev) => ({
      ...prev,
      category: categoryName,
      searchQuery: '',
      brand: 'all',
    }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayCategories = categories && categories.length > 0 ? categories : [];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore TWAKX Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Our Product Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setFilterState((prev) => ({ ...prev, category: 'all' }));
              setCurrentPage('shop');
            }}
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayCategories.map((cat) => {
            const count = products.filter(
              (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 p-3 sm:p-4 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Category Image */}
                <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-medium">
                    <span>{count > 0 ? `${count} items` : 'Collection'}</span>
                    <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
