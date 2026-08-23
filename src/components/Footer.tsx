import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Zap,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setFilterState, settings, categories } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setFilterState((prev) => ({ ...prev, category: categoryName, searchQuery: '' }));
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerCategories = (categories && categories.length > 0)
    ? categories.slice(0, 7)
    : [];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  2-3 Days Fast Delivery
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Speedy courier service (TCS, Trax & Leopard) to Karachi, Lahore, Islamabad & all Pakistan cities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  100% Genuine Products
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Authentic smart gadgets with official replacement warranty and premium build quality.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  7-Day Easy Replacement
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hassle-free 7 days checking warranty and prompt replacement support if any defect arises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                  Direct WhatsApp Support
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Instant order confirmation and tracking assistance on 03352732395.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Store Bio */}
          <div className="space-y-4">
            <div
              onClick={() => handlePageClick('home')}
              className="cursor-pointer inline-flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center text-white border border-indigo-500/40">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  TWAKX
                </span>
                <span className="text-[10px] text-amber-400 ml-1.5 font-bold uppercase tracking-widest">
                  SMART
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              TWAKX Smart Accessories & Gadgets is Pakistan's premier online store for high-performance wireless earbuds, AMOLED smartwatches, GaN fast chargers, heavy bass speakers, and essential everyday mobile and laptop accessories.
            </p>
            <div className="pt-2">
              <div className="text-xs text-slate-400 font-medium">
                Official Netlify Deployment:
              </div>
              <a
                href="https://twakx-smart-accessories.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 break-all font-mono underline"
              >
                https://twakx-smart-accessories.netlify.app/
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links & Shop */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">
              Categories & Catalog
            </h3>
            <ul className="space-y-2.5 text-xs">
              {footerCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support & Policies */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-400 pl-2">
              Customer Care & Policies
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handlePageClick('shipping-policy')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Shipping & Courier Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('refund-policy')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  7-Day Warranty & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('faq')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('about')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  About TWAKX Pakistan
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Contact Us & Location Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('privacy-policy')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('terms')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('blog')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Gadget Guides & Tech Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Pakistani Payment Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2">
              Contact & Payment Accounts
            </h3>
            <div className="space-y-3 text-xs">
              <a
                href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </a>

              <a
                href={`tel:${settings.phoneNumber}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white"
              >
                <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Call: {settings.phoneNumber}</span>
              </a>

              <a
                href={`mailto:${settings.supportEmail}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white"
              >
                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="break-all">{settings.supportEmail}</span>
              </a>

              {/* Payment details box */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Accepted Payment Methods</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <div className="flex justify-between py-0.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Cash on Delivery:</span>
                    <span className="font-medium text-emerald-400">All Pakistan (COD)</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Easypaisa:</span>
                    <span className="font-semibold text-white">{settings.easypaisaNumber}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right -mt-0.5">
                    Account: {settings.easypaisaAccountName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TWAKX Smart Accessories & Gadgets. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Currency: <strong>PKR (₨)</strong></span>
            <span>•</span>
            <span>Country: <strong>Pakistan 🇵🇰</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
