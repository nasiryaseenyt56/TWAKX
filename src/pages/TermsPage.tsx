import React from 'react';
import { useStore } from '../context/StoreContext';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { setCurrentPage, settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <button
          onClick={() => setCurrentPage('home')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Terms & Conditions</h1>
            <p className="text-xs text-slate-500 mt-0.5">Operating across all cities in Pakistan</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Order Placement & Verification</h2>
          <p>
            Orders placed on <strong>{settings.storeName || 'TWAKX Smart Accessories'}</strong> are subject to automated or WhatsApp verification. Please provide an active Pakistani mobile number for order confirmation prior to dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Nationwide Delivery & Payment</h2>
          <p>
            We deliver to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and all other cities in Pakistan. Orders are fulfilled through Cash on Delivery (COD) or verified Easypaisa advance payment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. 7-Day Replacement Warranty</h2>
          <p>
            All electronic gadgets and smart accessories include a 7-day checking/replacement warranty against manufacturing defects. Physical damage, water ingress, or improper misuse will void the warranty.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Pricing & Promotions</h2>
          <p>
            All prices listed on the store are denominated in Pakistani Rupees (PKR / ₨). Discounts, flash sales, and coupon codes apply as indicated at checkout.
          </p>
        </section>
      </div>
    </div>
  );
};
