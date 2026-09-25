import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
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
  Share2,
  Package,
  Clock,
  ArrowRight,
  Send,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setCurrentPage,
    setFilterState,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    generateQuickWhatsAppProductUrl,
    products,
    reviews,
    addReview,
    settings,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');
  const [copied, setCopied] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Auto-resolve product if null
  const product = selectedProduct || products[0];

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Catalog Loading...</h2>
        <p className="text-xs text-slate-500">Connecting to product catalog.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="mt-4 bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Return to Shop
        </button>
      </div>
    );
  }
  const currentPrice = product.salePrice ?? product.price;
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const url = generateQuickWhatsAppProductUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    addReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      verified: true,
    });
    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => setCurrentPage('home')} className="hover:text-slate-700">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => {
            setFilterState((prev) => ({ ...prev, category: product.category }));
            setCurrentPage('shop');
          }}
          className="hover:text-slate-700"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Section: Gallery + Purchase Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Stage & Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main big viewer */}
          <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            <img
              src={(product.images && product.images[activeImageIndex]) || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
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

          {/* Value props in Pakistan */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="font-bold text-slate-800">2-3 Day Delivery</p>
              <p className="text-[10px] text-slate-400">TCS / Trax Express</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="font-bold text-slate-800">100% Genuine</p>
              <p className="text-[10px] text-slate-400">Official Warranty</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <RotateCcw className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="font-bold text-slate-800">7 Days Return</p>
              <p className="text-[10px] text-slate-400">Defect Replacement</p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Price, Attributes & CTAs (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Social share */}
            <div className="flex items-center justify-between mt-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copied ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-200/90 space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                    ₨ {currentPrice.toLocaleString()}
                  </span>
                  {product.salePrice && (
                    <span className="text-base text-slate-400 line-through">
                      ₨ {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.salePrice && (
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    You save ₨ {(product.price - product.salePrice).toLocaleString()} (
                    {discountPercent}% OFF)
                  </p>
                )}
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  isOutOfStock
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isOutOfStock ? 'Sold Out' : `In Stock (${product.stock})`}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Cash on Delivery (COD) available across Pakistan. Free shipping on orders above ₨ 3,000.
            </p>
          </div>

          {/* Short Description & Highlights */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Features:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Purchase Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-800">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  -
                </button>
                <span className="px-5 py-2 text-xs font-bold text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  +
                </button>
              </div>

              {/* Wishlist & Compare Icons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 border rounded-2xl transition-all ${
                    isFavorited
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-2.5 border rounded-2xl transition-all ${
                    isCompared
                      ? 'border-amber-300 bg-amber-50 text-amber-600'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Compare"
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all uppercase tracking-wider ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-indigo-600 text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>

              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-wider"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Instant Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Deep Dive Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`py-3.5 px-6 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'desc'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Description
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-6 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-6 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-3.5 px-6 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'shipping'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Shipping & Warranty Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-lg font-bold text-slate-900">About {product.name}</h3>
              <p>{product.description}</p>
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-2">Package Contents:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>1x {product.name}</li>
                  <li>1x USB Fast Charging Cable</li>
                  <li>1x User Manual & Warranty Card (TWAKX Official)</li>
                  <li>Original Retail Packaging Box</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Detailed Product Specifications
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-700 w-1/3">Brand</td>
                      <td className="py-2.5 px-4 text-slate-900 font-semibold">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-slate-700">Category</td>
                      <td className="py-2.5 px-4 text-slate-900">{product.category}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-700">SKU / Model ID</td>
                      <td className="py-2.5 px-4 text-slate-900 font-mono">{product.sku}</td>
                    </tr>
                    {Object.entries(product.specs || {}).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-2.5 px-4 font-bold text-slate-700">{key}</td>
                        <td className="py-2.5 px-4 text-slate-900">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Existing reviews */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Customer Ratings for {product.name}
                </h3>
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    Be the first verified customer in Pakistan to write a review!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rev.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800">{rev.comment}</p>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <span>{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-emerald-600 text-[10px] font-normal">
                            (Verified Purchase)
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add review form */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Write a Verified Review
                </h4>
                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                    ✓ Thank you! Your review has been submitted and added to the product page.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Bilal Ahmed"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Rating (1 - 5 Stars)
                      </label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none"
                      >
                        <option value={5}>★★★★★ (5/5) - Excellent</option>
                        <option value={4}>★★★★☆ (4/5) - Good</option>
                        <option value={3}>★★★☆☆ (3/5) - Average</option>
                        <option value={2}>★★☆☆☆ (2/5) - Below Average</option>
                        <option value={1}>★☆☆☆☆ (1/5) - Poor</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Review Details
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others about sound quality, battery life, packaging..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-indigo-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Shipping Info */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900">
                Pakistan Shipping & Warranty Coverage
              </h3>
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  <strong>Delivery Timeframe:</strong> Orders placed before 4:00 PM PST are dispatched the same working day. Courier delivery takes <strong>2-3 working days</strong> for major cities (Karachi, Lahore, Rawalpindi, Islamabad, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala) and 3-4 days for other remote areas.
                </p>
                <p>
                  <strong>Courier Partners:</strong> We dispatch via TCS, Trax Logistics, Leopard Courier, and Call Courier with real-time SMS tracking.
                </p>
                <p>
                  <strong>Checking Warranty:</strong> You receive a 7-day checking warranty upon delivery. If any manufacturing defect is discovered, contact our WhatsApp at <strong>{settings.whatsappNumber}</strong> for instant replacement or refund.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Related Accessories You May Like
              </h3>
              <p className="text-xs text-slate-500">
                More smart gadgets from {product.category}
              </p>
            </div>
            <button
              onClick={() => {
                setFilterState((prev) => ({ ...prev, category: product.category }));
                setCurrentPage('shop');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
