import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Eye,
  Heart,
  Scale,
  Star,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
}) => {
  if (!product) return null;

  const {
    setSelectedProduct,
    setQuickViewProduct,
    setCurrentPage,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = (product.stock ?? 0) <= 0;

  const currentPrice = product.salePrice ?? product.price ?? 0;
  const discountPercent = product.salePrice && product.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Image source with hover swap
  const fallbackImg = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';
  const primaryImage = product.images?.[0] || fallbackImg;
  const secondaryImage = product.images?.[1] || primaryImage;

  if (viewMode === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all p-4 flex flex-col sm:flex-row gap-5 cursor-pointer relative"
      >
        {/* Left image */}
        <div className="relative w-full sm:w-48 h-48 bg-slate-100 rounded-xl overflow-hidden shrink-0">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                {product.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  isOutOfStock
                    ? 'bg-rose-100 text-rose-700'
                    : product.stock < 5
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : product.stock < 5
                  ? `Only ${product.stock} Left`
                  : 'In Stock (Nationwide)'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
              {product.shortDescription}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Pricing & View Details CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900 font-mono">
                  ₨ {currentPrice.toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ₨ {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                Free Shipping over ₨ 3,000
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product);
                }}
                className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
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
                onClick={handleCardClick}
                className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden relative"
    >
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            -{discountPercent}%
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-slate-950" /> HOT
          </span>
        )}
        {product.newArrival && (
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            NEW
          </span>
        )}
      </div>

      {/* Floating Hover Action Buttons (Right) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-1 sm:group-hover:translate-x-0">
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Compare */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
            isCompared
              ? 'bg-amber-500 text-slate-950'
              : 'bg-white/90 text-slate-700 hover:text-amber-600 hover:bg-white'
          }`}
          title="Compare Specs"
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider truncate">
              {product.category}
            </span>
            <span className="truncate">{product.brand}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{product.highlights[0]}</span>
            </p>
          )}
        </div>

        {/* Pricing & View Details Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  ₨ {currentPrice.toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ₨ {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-emerald-600 block">
                {product.stock > 0 ? '✓ Ready to dispatch' : 'Restocking soon'}
              </span>
            </div>
          </div>

          {/* Clean View Details Button */}
          <button
            onClick={handleCardClick}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-indigo-500/20 group-hover:bg-indigo-600"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
