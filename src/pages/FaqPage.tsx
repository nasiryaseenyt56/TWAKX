import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FAQS = [
  {
    q: 'How long does delivery take in Pakistan?',
    a: 'Delivery takes 2-3 working days for major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar) and 3-4 working days for other remote towns via TCS / Trax Express.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes! Cash on Delivery (COD) is available nationwide across 200+ cities and towns in Pakistan. You can pay cash directly to the courier rider upon package arrival.',
  },
  {
    q: 'How can I pay via Easypaisa or Cash on Delivery?',
    a: 'During checkout, select "Cash on Delivery (COD)" to pay in cash upon arrival, or select "Easypaisa" to transfer directly to our official mobile account (03378018331 - Nighat Ali). Simply transfer the amount and input your TRX number or sender phone.',
  },
  {
    q: 'Are your accessories 100% original and genuine?',
    a: 'Yes! All TWAKX, Soundcore, Haylou, Baseus, and Ugreen accessories are 100% authentic and come in factory retail packaging with warranty seals.',
  },
  {
    q: 'Can I open the package before paying the courier?',
    a: 'Under standard Pakistani courier regulations (TCS/Trax/Leopard), riders are not authorized to hand over open parcels before cash collection. However, you have a complete 7-Day Checking Replacement Warranty from TWAKX to test and verify the item safely at home.',
  },
  {
    q: 'What if my item arrives damaged or defective?',
    a: 'Contact our WhatsApp support team immediately at 03352732395 with your Order Number and a short video. We provide instant hassle-free replacements or refunds.',
  },
  {
    q: 'How do I track my order?',
    a: 'You can check your order tracking ID on the Order Confirmation page or enter your phone/order number in the "My Account" page. You can also message our WhatsApp support with your Order ID for instant live tracking updates.',
  },
];

export const FaqPage: React.FC = () => {
  const { settings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-20 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>HELP CENTER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions (FAQs)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about ordering, delivery, warranty, and payments at TWAKX.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-3">
        <h3 className="font-bold text-emerald-950 text-sm">Still have a question?</h3>
        <p className="text-xs text-emerald-800">
          Our friendly support team in Pakistan is available to chat on WhatsApp.
        </p>
        <a
          href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=Hello%20TWAKX`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp: {settings.whatsappNumber}</span>
        </a>
      </div>
    </div>
  );
};
