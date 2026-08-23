import React from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, ShieldCheck, Truck, RotateCcw, Headphones, Users, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>AUTHENTIC TECH ACCESSORIES IN PAKISTAN</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About TWAKX Smart Accessories & Gadgets
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          TWAKX was founded with a single mission: to provide tech enthusiasts, mobile gamers, and remote professionals in Pakistan with genuine, tested, and high-performance smart accessories backed by real customer warranty.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Genuine Tech</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every wireless earbud, smartwatch, and GaN fast charger in our catalog undergoes multi-point inspection before dispatch.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Nationwide 2-3 Day Dispatch</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Partnered with TCS and Trax Logistics for lightning-fast deliveries to Karachi, Lahore, Islamabad, Faisalabad, and all remote towns.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">7-Day Hassle-Free Warranty</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We provide a 7-day checking replacement warranty so you can shop with peace of mind without worrying about defective units.
          </p>
        </div>
      </div>

      {/* Official Business Information */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold">Official Business & Deployment Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <p className="text-slate-400 font-medium">Netlify Live Website:</p>
            <a
              href="https://twakx-smart-accessories.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline font-mono break-all"
            >
              https://twakx-smart-accessories.netlify.app/
            </a>
          </div>
          <div>
            <p className="text-slate-400 font-medium">WhatsApp Support:</p>
            <p className="font-mono text-white font-bold">{settings.whatsappNumber}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Official Email:</p>
            <p className="font-mono text-white font-bold">{settings.supportEmail}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Payment Accounts:</p>
            <p className="font-mono text-white font-bold">
              Easypaisa: {settings.easypaisaNumber} ({settings.easypaisaAccountName})
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-8 py-3.5 rounded-full transition-colors inline-block uppercase tracking-wider"
        >
          Explore Our Gadgets Catalog →
        </button>
      </div>
    </div>
  );
};
