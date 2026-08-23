import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shipping & Delivery Policy (Pakistan)
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: January 2026 • Fast 2-3 Days Courier Service
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span>1. Delivery Timeframes & Speed</span>
          </h2>
          <p>
            At <strong>TWAKX Smart Accessories & Gadgets</strong>, we partner with Pakistan's most reliable courier networks (TCS Express, Trax Logistics, Leopard Courier, and Call Courier) to ensure rapid and safe dispatch.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li><strong>Major Metros (Karachi, Lahore, Islamabad, Rawalpindi):</strong> 2 to 3 working days.</li>
            <li><strong>Second-Tier Cities (Faisalabad, Multan, Sialkot, Peshawar, Gujranwala, Hyderabad):</strong> 2 to 4 working days.</li>
            <li><strong>Remote & Interior Areas:</strong> 3 to 5 working days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>2. Same-Day Order Dispatch Cut-Off</span>
          </h2>
          <p>
            All confirmed orders placed before <strong>4:00 PM Pakistan Standard Time (PST)</strong> from Monday to Saturday are packed, barcode-scanned, and handed over to our courier partner on the exact same day. Orders placed on Sundays or public holidays are dispatched on the next working business morning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>3. Shipping Charges & Free Delivery Threshold</span>
          </h2>
          <p>
            Standard flat courier delivery across Pakistan is <strong>₨ 200</strong>. Orders with a cart total equal to or exceeding <strong>₨ {settings.freeShippingThreshold.toLocaleString()}</strong> qualify for <strong>100% FREE Delivery</strong> automatically applied at checkout.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>4. Cash on Delivery (COD) Rules</span>
          </h2>
          <p>
            For Cash on Delivery orders, please ensure the exact cash amount is available when the courier rider arrives. An automated SMS and WhatsApp confirmation will be sent upon dispatch containing your live tracking number.
          </p>
        </section>
      </div>
    </div>
  );
};
