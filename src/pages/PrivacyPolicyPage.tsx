import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Lock, Eye, CheckCircle, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-0.5">Last updated: August 2026</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            At <strong>{settings.storeName || 'TWAKX Smart Accessories'}</strong>, we respect your privacy. When you place an order for smart accessories or interact with our store, we collect necessary customer details including your name, contact phone number, WhatsApp number, city, shipping address, and optional email address to process Cash on Delivery (COD) and courier delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Dispatching parcels via licensed courier partners (TCS, Trax, Leopard, Call Courier, PostEx).</li>
            <li>Sending SMS and WhatsApp order verification, dispatch updates, and tracking numbers.</li>
            <li>Providing 7-day warranty support, replacements, and customer service.</li>
            <li>Improving product recommendations and store speed.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Payment Security & No Card Storage</h2>
          <p>
            We do not store your credit/debit card numbers or bank credentials. Transactions conducted via <strong>Cash on Delivery (COD)</strong> or <strong>Easypaisa</strong> are processed directly through secure channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Contact & Inquiries</h2>
          <p>
            If you have questions regarding your data, please contact our support team at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-indigo-600 font-bold underline">
              {settings.supportEmail}
            </a>{' '}
            or WhatsApp at{' '}
            <span className="font-mono font-bold text-slate-900">{settings.whatsappNumber}</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
