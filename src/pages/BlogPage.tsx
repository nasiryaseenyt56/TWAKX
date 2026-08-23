import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, ArrowLeft, ArrowRight, Calendar, User, Clock, Zap, Headphones, Watch } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { setCurrentPage, setFilterState } = useStore();

  const posts = [
    {
      id: '1',
      title: 'Top 5 Best ANC Wireless Earbuds in Pakistan for 2026 Under ₨ 5,000',
      category: 'Audio & Earbuds',
      date: 'August 18, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Looking for deep bass, crisp calls, and true Active Noise Cancellation on a budget? Here is our comprehensive comparison of top earbuds in Pakistan.',
      targetCategory: 'Wireless Earbuds',
    },
    {
      id: '2',
      title: 'GaN Fast Chargers vs Traditional Chargers: Why 65W Fast Charging Matters',
      category: 'Charging Tech',
      date: 'August 10, 2026',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      excerpt: 'Learn how Gallium Nitride (GaN) technology keeps chargers cooler, 50% smaller, and charges your iPhone, Samsung Galaxy, and laptop simultaneously.',
      targetCategory: 'Chargers & Cables',
    },
    {
      id: '3',
      title: 'How to Choose the Best AMOLED Smartwatch for Battery Life & Fitness',
      category: 'Smartwatches',
      date: 'August 02, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      excerpt: 'A guide to Bluetooth calling, Always-On AMOLED displays, Heart Rate tracking, and battery optimization for smartwatches in Pakistan.',
      targetCategory: 'Smart Watches',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                TWAKX Tech & Gadget Guides
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Expert tips, unboxings, buying guides, and tech reviews for Pakistan
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
        >
          Browse All Gadgets
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-amber-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 pt-0">
              <button
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, category: post.targetCategory }));
                  setCurrentPage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
              >
                <span>Shop Related Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
