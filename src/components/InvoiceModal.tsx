import React from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Printer, Download, Zap, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 p-6 sm:p-8 animate-in fade-in duration-150">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Order Invoice & Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="space-y-6 text-slate-800 text-xs">
          {/* Header & Logo */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-xl font-black font-mono text-slate-900 tracking-tight">
                  TWAKX
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                TWAKX Smart Accessories & Gadgets
              </p>
              <p className="text-[10px] text-slate-500">
                WhatsApp / Support: {settings.whatsappNumber}
              </p>
              <p className="text-[10px] text-slate-500">
                Email: {settings.supportEmail}
              </p>
            </div>

            <div className="text-right">
              <div className="text-base font-black text-slate-900 font-mono">
                INVOICE #{order.orderNumber}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Tracking: {order.trackingNumber}
              </p>
              <div className="mt-1 inline-block bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Status: {order.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Billed / Shipped To:
              </div>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 mt-0.5">{order.address}</p>
              <p className="text-slate-600 font-medium">City: {order.city}, Pakistan</p>
              <p className="text-slate-600">Phone: {order.customerPhone}</p>
              {order.customerWhatsApp && (
                <p className="text-slate-600">WhatsApp: {order.customerWhatsApp}</p>
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Payment & Dispatch Details:
              </div>
              <p className="font-semibold text-slate-900">
                Method:{' '}
                {order.paymentMethod === 'easypaisa'
                  ? `Easypaisa (${settings.easypaisaNumber})`
                  : 'Cash on Delivery (COD)'}
              </p>
              <p className="text-slate-600 mt-1">
                Delivery: 2-3 Working Days (TCS/Trax Express)
              </p>
              {order.orderNotes && (
                <p className="text-slate-500 italic mt-1">Notes: {order.orderNotes}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ₨ {item.price.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold font-mono">
                      ₨ {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">
                  ₨ {order.subtotal.toLocaleString()}
                </span>
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
                <span>Total Amount:</span>
                <span className="font-mono text-base text-indigo-700">
                  ₨ {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
            <p className="font-semibold text-slate-700">
              Thank you for shopping with TWAKX Smart Accessories & Gadgets!
            </p>
            <p className="mt-0.5">
              For any queries, warranty claims or exchange, contact WhatsApp 03352732395.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
