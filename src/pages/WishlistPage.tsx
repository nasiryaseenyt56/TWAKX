import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, setCurrentPage } = useStore();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save your favorite smart gadgets and accessories to keep track of sales and discounts.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-8 py-3 rounded-full transition-colors inline-block"
        >
          Explore Catalog →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wishlist ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Products saved to your device. Add them to your cart when ready to order.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('shop')}
          className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
