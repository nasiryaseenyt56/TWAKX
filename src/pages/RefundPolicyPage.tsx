import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const RefundPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          7-Day Warranty & Refund Policy
        </h1>
        <p className="text-xs text-slate-500">
          Our commitment to 100% customer satisfaction across Pakistan
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-600" />
            <span>1. 7-Day Checking Replacement Warranty</span>
          </h2>
          <p>
            All electronic items (Wireless Earbuds, Smartwatches, GaN Chargers, Power Banks, and Speakers) purchased from <strong>TWAKX Smart Accessories & Gadgets</strong> come with an official <strong>7-Day Checking Replacement Warranty</strong> starting from the day your parcel is delivered by the courier.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>2. What is Covered under Warranty</span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>Factory manufacturing defects (e.g. one side earbud not connecting or charging).</li>
            <li>Display or touchscreen malfunction on smartwatches.</li>
            <li>Power delivery / charging failure on GaN adapters or power banks.</li>
            <li>Damage incurred strictly in courier transit (must report within 24 hours with unboxing video).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>3. What is NOT Covered</span>
          </h2>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>Physical accidental damage (drops, broken glass, crushed shell).</li>
            <li>Water or liquid damage on non-waterproof models or beyond IP rating limits.</li>
            <li>Burn marks caused by electrical power surges or unauthorized voltage adapters.</li>
            <li>Products returned without original packaging box, accessories, and warranty seal.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <span>4. How to Claim Replacement / Refund</span>
          </h2>
          <p>
            To initiate a claim, simply contact our WhatsApp support team at <strong>{settings.whatsappNumber}</strong> or email <strong>{settings.supportEmail}</strong> with your Order Number, a short 10-second video demonstrating the defect, and clear photos of the packaging box. Our team will verify and dispatch a replacement unit within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
};
