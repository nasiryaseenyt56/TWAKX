import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `Hello TWAKX, I would like to inquire about customer support.`;
    const url = `https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 pb-20 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Contact TWAKX Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Need help with your order, warranty replacement, or product recommendations? Our team is available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Card */}
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-sm">Direct WhatsApp Care</h3>
                <p className="text-[11px] text-emerald-700">Instant response under 5 mins</p>
              </div>
            </div>
            <p className="text-xs text-emerald-900 font-mono font-bold">
              {settings.whatsappNumber}
            </p>
            <button
              onClick={handleWhatsAppDirect}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
            </button>
          </div>

          {/* Phone & Email */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Phone Calls</p>
                <p className="text-slate-500 font-mono">{settings.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Email Inquiries</p>
                <p className="text-slate-500 font-mono">{settings.supportEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Operating Hours</p>
                <p className="text-slate-500">Monday – Sunday: 9:00 AM to 10:00 PM PST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-indigo-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Dispatch Hub</p>
                <p className="text-slate-500">Karachi Main Logistics Center, Sindh, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">Send Us a Message</h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you, {name}! Our support team will get back to you shortly via phone or email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Message or Order ID *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you? (e.g. tracking inquiry, earbud compatibility question...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
