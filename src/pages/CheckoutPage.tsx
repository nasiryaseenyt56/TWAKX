import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { PAKISTAN_CITIES } from '../lib/mockData';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  MessageCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    shippingFee,
    appliedCoupon,
    placeOrder,
    setCurrentPage,
    settings,
    user,
  } = useStore();

  // Form State
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'easypaisa'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-full"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms & Conditions and Warranty Policy.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber'> = {
        userId: user?.uid,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        customerWhatsApp: sameAsPhone ? customerPhone.trim() : customerWhatsApp.trim(),
        address: address.trim(),
        city,
        postalCode: postalCode.trim() || undefined,
        orderNotes: orderNotes.trim() || undefined,
        items: cart.filter((i) => i?.product).map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.salePrice ?? i.product.price ?? 0,
          quantity: i.quantity,
          image: i.product.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
          sku: i.product.sku || 'TWK-GEN-001',
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        status: 'pending',
      };

      const placed = await placeOrder(orderData);

      // Trigger automatic WhatsApp confirmation redirect prompt
      const whatsappMsg = `*New Order Placed on TWAKX!* 🇵🇰\n\n*Order #:* ${placed.orderNumber}\n*Name:* ${placed.customerName}\n*Phone:* ${placed.customerPhone}\n*City:* ${placed.city}\n*Address:* ${placed.address}\n*Total:* ₨ ${placed.total.toLocaleString()} (${placed.paymentMethod.toUpperCase()})\n\n*Items:*\n${placed.items.map((i) => `• ${i.name} x${i.quantity} (₨ ${i.price})`).join('\n')}`;
      
      const cleanWa = settings.whatsappNumber.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/92${cleanWa.replace(/^0/, '')}?text=${encodeURIComponent(whatsappMsg)}`;

      // Open WA in new tab for customer confirmation if requested
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Navigate to order confirmation page
      setCurrentPage('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Dispatch
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter your delivery details in Pakistan. Cash on Delivery (COD) & Instant Easypaisa supported.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                1. Delivery & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Address (Optional for invoice)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. ali@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mobile Number (for Courier SMS) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  disabled={sameAsPhone}
                  value={sameAsPhone ? customerPhone : customerWhatsApp}
                  onChange={(e) => setCustomerWhatsApp(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 font-mono disabled:opacity-60"
                />
                <label className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Same as mobile number</span>
                </label>
              </div>
            </div>

            {/* Address */}
            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">
                Complete Street Address (House/Flat #, Street, Area) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House # 123, Street 4, Block B, North Nazimabad..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600"
              />
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  City (Pakistan) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-semibold text-slate-800"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 74600"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none font-mono"
                />
              </div>
            </div>

            {/* Order Notes */}
            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">
                Order Notes / Special Delivery Instructions
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Call before delivering, deliver after 2 PM..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                2. Select Payment Method
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* COD Option */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Pay in cash directly to the courier rider (TCS / Trax / Leopard) when your package is delivered.
                  </p>
                </div>
              </label>

              {/* Easypaisa Option */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="easypaisa"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-emerald-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Easypaisa Mobile Account Transfer
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Instant Dispatch
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Transfer order amount to our official Easypaisa account.
                  </p>

                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">
                            Easypaisa Number:
                          </p>
                          <p className="text-sm font-mono font-bold text-emerald-800">
                            {settings.easypaisaNumber}
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium">
                            Title: <strong>{settings.easypaisaAccountName}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(settings.easypaisaNumber)}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAccount ? 'Copied' : 'Copy No.'}</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-emerald-100">
                        <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                          Sender Number or Transaction ID (TRX):
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. 03378018331 or 1234567890"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Review Your Order ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Items summary */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1 text-xs">
              {cart.filter((item) => item?.product).map((item) => {
                const unitPrice = item.product.salePrice ?? item.product.price ?? 0;
                const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';
                return (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={itemImg}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × ₨ {unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ₨ {(unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  ₨ {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon?.code}):</span>
                  <span className="font-mono">-₨ {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₨ ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Payable Amount:</span>
                <span className="text-xl text-indigo-700 font-mono">
                  ₨ {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600"
                />
                <span className="text-[11px] leading-snug">
                  I agree to TWAKX's 7-Day Replacement Warranty and confirm my shipping address in {city}, Pakistan.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting
                  ? 'Processing Order...'
                  : `Confirm & Place Order (₨ ${cartTotal.toLocaleString()})`}
              </span>
            </button>

            {/* WhatsApp Alternative */}
            <div className="pt-1 text-center">
              <p className="text-[11px] text-slate-400 mb-2">
                Prefer placing your order manually?
              </p>
              <a
                href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}?text=${encodeURIComponent(
                  `Hello TWAKX, I would like to place an order for ${cart.map((i) => `${i.product.name} (Qty ${i.quantity})`).join(', ')}. Total: ₨ ${cartTotal.toLocaleString()}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
