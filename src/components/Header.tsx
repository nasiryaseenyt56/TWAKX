import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  User as UserIcon,
  Menu,
  X,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  Headphones,
  Watch,
  Smartphone,
  Laptop,
  Flame,
  LogOut,
  Lock,
  Grid,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setSelectedProduct,
    setFilterState,
    cartItemCount,
    cartSubtotal,
    wishlist,
    compareList,
    setIsCartDrawerOpen,
    user,
    isAdmin,
    loginWithGoogle,
    logout,
    settings,
    products,
    categories,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilterState((prev) => ({ ...prev, searchQuery: searchQuery.trim() }));
      setCurrentPage('shop');
      setIsSearchFocused(false);
    }
  };

  const searchResults = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleCategoryClick = (catName: string) => {
    setFilterState((prev) => ({ ...prev, category: catName, searchQuery: '' }));
    setCurrentPage('shop');
    setMobileMenuOpen(false);
  };

  const navigateTo = (page: any) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top Announcement Bar */}
      {settings.bannerActive && (
        <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="inline-flex items-center justify-center bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                PAKISTAN EXPRESS
              </span>
              <span className="font-medium text-slate-200">
                {settings.announcementText}
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-xs divide-x divide-slate-700">
              <a
                href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=Hello%20TWAKX`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors pl-2"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </a>
              <button
                onClick={() => navigateTo('contact')}
                className="hover:text-amber-400 transition-colors pl-3 hidden md:inline-block"
              >
                Track Order
              </button>
              <button
                onClick={() => navigateTo('about')}
                className="hover:text-amber-400 transition-colors pl-3 hidden lg:inline-block"
              >
                Why TWAKX
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-slate-700 hover:text-slate-950 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* TWAKX Brand Logo */}
          <div
            id="header-brand-logo"
            onClick={() => navigateTo('home')}
            className="cursor-pointer flex items-center gap-2.5 select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center text-white shadow-md shadow-slate-900/10 border border-slate-700">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-mono">
                  TWAKX
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  PK
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block -mt-1">
                Smart Accessories & Gadgets
              </p>
            </div>
          </div>

          {/* Central Live Search Bar */}
          <div className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search earbuds, smart watches, chargers, cables, power banks..."
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-full border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-4 rounded-full transition-colors flex items-center gap-1"
              >
                Search
              </button>
            </form>

            {/* Predictive Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 border-b border-slate-100">
                  Matching Products
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        navigateTo('product-detail');
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-indigo-700">
                            ₨ {(product.salePrice ?? product.price).toLocaleString()}
                          </span>
                          {product.salePrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₨ {product.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full text-center py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 border-t border-slate-100 block transition-colors"
                >
                  View all results in Shop →
                </button>
              </div>
            )}
          </div>

          {/* Right Action Icons (Compare, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Compare */}
            <button
              id="header-compare-btn"
              onClick={() => navigateTo('compare')}
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:flex items-center justify-center"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* My Account Menu */}
            <div className="relative">
              <button
                id="header-account-btn"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-full sm:rounded-xl transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <span className="text-[10px] text-slate-400 block -mb-1">
                    {user ? 'My Account' : 'Sign In'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[90px] block">
                    {user ? user.displayName?.split(' ')[0] : 'Account'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.displayName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>Order History & Profile</span>
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => navigateTo('admin')}
                          className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                        >
                          <Lock className="w-4 h-4 text-amber-600" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 text-center border-b border-slate-100">
                        <p className="text-xs text-slate-600 mb-2">
                          Sign in to sync your orders or manage store
                        </p>
                        <button
                          onClick={() => navigateTo('account')}
                          className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-xs"
                        >
                          Login / Account
                        </button>
                      </div>
                      <button
                        onClick={() => navigateTo('account')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4 text-slate-500" />
                        <span>Track My Order</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              id="header-cart-drawer-trigger"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 bg-slate-900 hover:bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-indigo-500/20"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-slate-300 block -mb-1 uppercase font-semibold">
                  Cart
                </span>
                <span className="text-xs font-bold text-amber-300">
                  ₨ {cartSubtotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search earbuds, watches, chargers..."
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-100 text-slate-900 rounded-full border border-slate-200 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-slate-900 text-white text-[11px] font-semibold px-3 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop Mega Categories) */}
      <div className="bg-slate-50 border-t border-slate-200/80 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between text-xs font-medium text-slate-700">
            <div className="flex items-center space-x-1 py-1">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3 py-2 rounded-lg transition-colors font-semibold ${
                  currentPage === 'home'
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, category: 'all', searchQuery: '' }));
                  navigateTo('shop');
                }}
                className={`px-3 py-2 rounded-lg transition-colors font-semibold ${
                  currentPage === 'shop'
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Accessories
              </button>

              {/* Dynamic Categories */}
              {(categories || []).slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <span>{cat.name}</span>
                </button>
              ))}

              <button
                onClick={() => navigateTo('about')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'about' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'contact' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Contact Us
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=Assalam-o-Alaikum%20TWAKX`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Helpline: {settings.whatsappNumber}</span>
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Mobile Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="font-bold font-mono text-lg">TWAKX MENU</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist ({wishlist.length})</span>
                </button>
                <button
                  onClick={() => navigateTo('compare')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>Compare ({compareList.length})</span>
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="flex-1 p-4 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                Shop By Category
              </p>
              <button
                onClick={() => {
                  setFilterState((prev) => ({ ...prev, category: 'all' }));
                  navigateTo('shop');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-semibold text-indigo-600 flex items-center justify-between"
              >
                <span>All Products Catalog</span>
                <span>→</span>
              </button>
              {(categories || []).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 text-sm font-medium text-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-5 h-5 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="text-slate-400 text-xs">›</span>
                </button>
              ))}

              <div className="border-t border-slate-200 my-3 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                  Company & Policies
                </p>
                <button
                  onClick={() => navigateTo('about')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  About TWAKX
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Contact Us & Track Order
                </button>
                <button
                  onClick={() => navigateTo('faq')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Frequently Asked Questions (FAQs)
                </button>
                <button
                  onClick={() => navigateTo('shipping-policy')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Shipping & 2-3 Day Delivery
                </button>
                <button
                  onClick={() => navigateTo('refund-policy')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  7-Day Warranty & Refund Policy
                </button>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 bg-slate-900 text-slate-300 text-xs">
              <a
                href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </a>
              <p className="text-center text-[11px] text-slate-400">
                Easypaisa: {settings.easypaisaNumber} ({settings.easypaisaAccountName})
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
