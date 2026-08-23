import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  X,
  Search,
  Check,
  ChevronDown,
  Filter,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    filteredProducts,
    filterState,
    setFilterState,
    resetFilters,
    products,
    categories,
  } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive unique brands
  const allBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);

  const activeFiltersCount =
    (filterState.category !== 'all' ? 1 : 0) +
    (filterState.brand !== 'all' ? 1 : 0) +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.onSaleOnly ? 1 : 0) +
    (filterState.searchQuery ? 1 : 0) +
    (filterState.maxPrice < 15000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>Home</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Shop Catalog</span>
          {filterState.category !== 'all' && (
            <>
              <span>/</span>
              <span className="text-indigo-600 font-bold">{filterState.category}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {filterState.category === 'all'
            ? 'All Smart Accessories & Gadgets'
            : filterState.category}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Showing authentic accessories with cash on delivery and 7-day replacement warranty in Pakistan.
        </p>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Filter by Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={(e) =>
                  setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Search within results..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-indigo-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Categories
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, category: 'all' }))}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  filterState.category === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>

              {(categories || []).map((cat) => {
                const count = products.filter((p) => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                const isSelected = filterState.category?.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, category: cat.name }))
                    }
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[11px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Brand
            </label>
            <div className="space-y-1 text-xs max-h-44 overflow-y-auto">
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, brand: 'all' }))}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  filterState.brand === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
              </button>
              {allBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setFilterState((prev) => ({ ...prev, brand }))}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    filterState.brand === brand
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{brand}</span>
                  <span className="text-[11px] text-slate-400">
                    {products.filter((p) => p.brand === brand).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <span>Max Price</span>
              <span className="text-indigo-600 font-mono">
                ₨ {filterState.maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={filterState.maxPrice}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value),
                }))
              }
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₨ 1,000</span>
              <span>₨ 15,000+</span>
            </div>
          </div>

          {/* Checkboxes: In Stock / On Sale */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
              <input
                type="checkbox"
                checked={filterState.inStockOnly}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    inStockOnly: e.target.checked,
                  }))
                }
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="font-medium">In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
              <input
                type="checkbox"
                checked={filterState.onSaleOnly}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    onSaleOnly: e.target.checked,
                  }))
                }
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="font-medium">Discounted / On Sale Only</span>
            </label>
          </div>
        </aside>

        {/* Right Products Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Controls Toolbar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {/* Results count */}
            <div className="text-xs text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
              {products.length} products
            </div>

            {/* Sort Dropdown & View Mode */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={filterState.sortBy}
                  onChange={(e) =>
                    setFilterState((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Active:</span>
              {filterState.category !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Category: {filterState.category}
                  <button
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, category: 'all' }))
                    }
                  >
                    <X className="w-3 h-3 text-indigo-500 hover:text-indigo-900" />
                  </button>
                </span>
              )}

              {filterState.brand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Brand: {filterState.brand}
                  <button
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, brand: 'all' }))
                    }
                  >
                    <X className="w-3 h-3 text-indigo-500 hover:text-indigo-900" />
                  </button>
                </span>
              )}

              {filterState.inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  In Stock Only
                  <button
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, inStockOnly: false }))
                    }
                  >
                    <X className="w-3 h-3 text-emerald-500 hover:text-emerald-900" />
                  </button>
                </span>
              )}

              {filterState.onSaleOnly && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  On Sale
                  <button
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, onSaleOnly: false }))
                    }
                  >
                    <X className="w-3 h-3 text-rose-500 hover:text-rose-900" />
                  </button>
                </span>
              )}

              {filterState.searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  "{filterState.searchQuery}"
                  <button
                    onClick={() =>
                      setFilterState((prev) => ({ ...prev, searchQuery: '' }))
                    }
                  >
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-900" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No matching accessories found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your current filter criteria. Try adjusting price, category or brand filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors inline-block"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="font-bold text-base text-slate-900">Filter Products</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content mirroring desktop */}
            <div className="space-y-5 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-2">Category</label>
                <select
                  value={filterState.category}
                  onChange={(e) =>
                    setFilterState((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                >
                  <option value="all">All Categories</option>
                  {(categories || []).map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2">Brand</label>
                <select
                  value={filterState.brand}
                  onChange={(e) =>
                    setFilterState((prev) => ({ ...prev, brand: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                >
                  <option value="all">All Brands</option>
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-2">
                  <span>Max Price</span>
                  <span className="font-mono text-indigo-600">
                    ₨ {filterState.maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={filterState.maxPrice}
                  onChange={(e) =>
                    setFilterState((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterState.inStockOnly}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        inStockOnly: e.target.checked,
                      }))
                    }
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterState.onSaleOnly}
                    onChange={(e) =>
                      setFilterState((prev) => ({
                        ...prev,
                        onSaleOnly: e.target.checked,
                      }))
                    }
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <span>On Sale Only</span>
                </label>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
