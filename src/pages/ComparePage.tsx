import React from 'react';
import { useStore } from '../context/StoreContext';
import { Scale, X, ShoppingCart, Star, Trash2, ArrowRight } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const {
    compareList,
    products,
    removeFromCompare,
    clearCompare,
    addToCart,
    setCurrentPage,
    setSelectedProduct,
  } = useStore();

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">No Products in Comparison</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Click the compare icon on any accessory card to compare specs, battery life, drivers, and pricing side-by-side.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-8 py-3 rounded-full transition-colors inline-block"
        >
          Go to Shop Catalog →
        </button>
      </div>
    );
  }

  // Collect all unique spec keys
  const allSpecKeys: string[] = Array.from(
    new Set(comparedProducts.flatMap((p) => Object.keys(p.specs || {})))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Comparison ({comparedProducts.length} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare features, specs and pricing side-by-side to choose the best gadget.
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left divide-y divide-slate-200 text-xs">
          {/* Header Row: Images & Titles */}
          <thead className="bg-slate-50">
            <tr>
              <th className="py-4 px-4 font-bold text-slate-700 w-48 shrink-0">Product Info</th>
              {comparedProducts.map((p) => (
                <th key={p.id} className="py-4 px-4 min-w-[220px] max-w-[260px] align-top">
                  <div className="relative space-y-3">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-600 rounded-full"
                      title="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      onClick={() => {
                        setSelectedProduct(p);
                        setCurrentPage('product-detail');
                      }}
                      className="w-24 h-24 object-cover rounded-xl bg-slate-100 border border-slate-200 cursor-pointer"
                    />

                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        {p.category}
                      </span>
                      <h4
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentPage('product-detail');
                        }}
                        className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 cursor-pointer mt-0.5"
                      >
                        {p.name}
                      </h4>
                    </div>

                    <div className="pt-1">
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₨ {(p.salePrice ?? p.price).toLocaleString()}
                      </div>
                      {p.salePrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          ₨ {p.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Rating */}
            <tr>
              <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">Customer Rating</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="py-3 px-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-slate-800">{p.rating}</span>
                    <span className="text-slate-400 text-[11px]">({p.reviewCount} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr>
              <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">Brand / Maker</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="py-3 px-4 font-semibold text-slate-800">
                  {p.brand}
                </td>
              ))}
            </tr>

            {/* Stock Availability */}
            <tr>
              <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">Stock in Pakistan</td>
              {comparedProducts.map((p) => (
                <td key={p.id} className="py-3 px-4">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      p.stock > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>

            {/* Dynamic Specs Rows */}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50">{key}</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-700">
                    {p.specs?.[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
