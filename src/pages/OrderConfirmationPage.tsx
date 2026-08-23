import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  CheckCircle2,
  Package,
  Truck,
  MessageCircle,
  Printer,
  ArrowRight,
  Copy,
  Check,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastPlacedOrder, setCurrentPage, settings } = useStore();
  const [showInvoice, setShowInvoice] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No recent order found</h2>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-full"
        >
          Browse Shop Catalog
        </button>
      </div>
    );
  }

  const order = lastPlacedOrder;

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppTrack = () => {
    const msg = `Hello TWAKX, I would like to track my order status. Order #${order.orderNumber} (Tracking: ${order.trackingNumber}).`;
    const url = `https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-xs">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          We have received your order <strong>#{order.orderNumber}</strong>. Our dispatch team is preparing your package for courier dispatch.
        </p>

        <div className="inline-flex items-center gap-2 bg-emerald-700/80 px-4 py-2 rounded-2xl text-xs font-mono">
          <span>Tracking ID: <strong>{order.trackingNumber}</strong></span>
          <button
            onClick={handleCopyTracking}
            className="p-1 hover:bg-emerald-600 rounded-md transition-colors"
            title="Copy Tracking ID"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Courier Delivery Timeline Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Delivery Status & Tracking
          </h2>
          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated Delivery: 2-3 Working Days</span>
          </span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="flex sm:flex-col items-center gap-3 sm:text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-emerald-500/20">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Order Confirmed</p>
              <p className="text-[11px] text-slate-400">Order #{order.orderNumber}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex sm:flex-col items-center gap-3 sm:text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-indigo-600/20">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Packing & QC</p>
              <p className="text-[11px] text-slate-400">Karachi Warehouse</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex sm:flex-col items-center gap-3 sm:text-center opacity-70">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">TCS / Trax Courier</p>
              <p className="text-[11px] text-slate-400">In Transit</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex sm:flex-col items-center gap-3 sm:text-center opacity-70">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Delivered</p>
              <p className="text-[11px] text-slate-400">{order.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Invoice & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setShowInvoice(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>View & Print Official Invoice Receipt</span>
        </button>

        <button
          onClick={handleWhatsAppTrack}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact WhatsApp Support ({settings.whatsappNumber})</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Order Details & Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Customer & Shipping Details
            </span>
            <p className="font-bold text-slate-900 text-sm mt-1">{order.customerName}</p>
            <p className="text-slate-600 mt-0.5">{order.address}</p>
            <p className="text-slate-600 font-medium">City: {order.city}, Pakistan</p>
            <p className="text-slate-600 mt-1 font-mono">Phone: {order.customerPhone}</p>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px]">
              Payment & Dispatch Mode
            </span>
            <p className="font-bold text-slate-900 text-sm mt-1 uppercase">
              {order.paymentMethod === 'easypaisa'
                ? 'Easypaisa Mobile Transfer'
                : 'Cash on Delivery (COD)'}
            </p>
            <p className="text-slate-600 mt-0.5">
              Status: <span className="font-bold text-emerald-600">{order.status.toUpperCase()}</span>
            </p>
            <p className="text-slate-600 mt-0.5">
              Courier Partner: TCS / Trax Logistics Express
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-2 text-xs">
          {order.items.map((item, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900">
                ₨ {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end text-xs">
          <div className="w-56 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₨ {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span className="font-mono">-₨ {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee:</span>
              <span className="font-mono font-semibold">
                {order.shipping === 0 ? 'FREE' : `₨ ${order.shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid/Due:</span>
              <span className="text-base text-indigo-700 font-mono">
                ₨ {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Return to shop */}
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <span>Continue Shopping at TWAKX</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Invoice Modal */}
      {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}
    </div>
  );
};
