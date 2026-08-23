import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  ShoppingCart,
  Zap,
  Check,
  Heart,
  Scale,
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setSelectedProduct,
    setCurrentPage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    generateQuickWhatsAppProductUrl,
    settings,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isOutOfStock = product.stock <= 0;
  const currentPrice = product.salePrice ?? product.price;
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleClose = () => {
    setQuickViewProduct(null);
    setActiveImageIndex(0);
    setQuantity(1);
  };

  const handleFullDetail = () => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    handleClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppOrder = () => {
    const url = generateQuickWhatsAppProductUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              <img
                src={(product.images && product.images[activeImageIndex]) || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>2-3 Days Fast TCS/Trax</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Genuine with Warranty</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-indigo-600 uppercase tracking-wider">
                  {product.category}
                </span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating || 5}</span>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount || 0} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₨ {currentPrice.toLocaleString()}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₨ {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Inclusive of all taxes + COD Available
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    isOutOfStock
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock})`}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Key Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {product.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 border rounded-xl transition-colors ${
                      isFavorited
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`p-2 border rounded-xl transition-colors ${
                      isCompared
                        ? 'border-amber-300 bg-amber-50 text-amber-600'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Compare"
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-2">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <span>Add to Cart (₨ {(currentPrice * quantity).toLocaleString()})</span>
                </button>

                <button
                  onClick={handleFullDetail}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Full Product Specs & Customer Reviews →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
