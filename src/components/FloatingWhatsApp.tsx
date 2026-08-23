import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, Send, Sparkles, Truck, HelpCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;

  const handleStartChat = (textToUse?: string) => {
    const message = textToUse || customMessage || 'Hello TWAKX, I need help with a product/order.';
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Interactive Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 border border-emerald-400 flex items-center justify-center font-bold font-mono text-white">
                  TW
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">TWAKX WhatsApp Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                  Typically replies in under 5 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3 max-h-72 overflow-y-auto text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 text-slate-800 space-y-1">
              <p className="font-semibold text-slate-900">
                Assalam-o-Alaikum! Welcome to TWAKX 🇵🇰
              </p>
              <p className="text-slate-600 text-[11px]">
                How can we assist you today? You can choose a quick topic or type your query below:
              </p>
            </div>

            {/* Quick action chips */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() =>
                  handleStartChat('Hello TWAKX, I would like to track my order. My Order ID is: ')
                }
                className="w-full text-left bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 transition-colors font-medium text-[11px]"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Track my dispatched parcel (Order ID)</span>
              </button>

              <button
                onClick={() =>
                  handleStartChat('Hello TWAKX, can you recommend the best wireless earbuds under ₨ 4,000?')
                }
                className="w-full text-left bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 transition-colors font-medium text-[11px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Product recommendations & stock check</span>
              </button>

              <button
                onClick={() =>
                  handleStartChat('Hello TWAKX, I need assistance with Easypaisa / JazzCash payment confirmation.')
                }
                className="w-full text-left bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 transition-colors font-medium text-[11px]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Payment & Easypaisa Transfer inquiry</span>
              </button>
            </div>
          </div>

          {/* Input box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartChat()}
              placeholder="Type your message..."
              className="flex-1 text-xs bg-slate-100 text-slate-800 rounded-full px-3.5 py-2 border border-slate-200 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleStartChat()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="text-xs tracking-wide hidden sm:inline-block">
          Order on WhatsApp
        </span>
      </button>
    </div>
  );
};
