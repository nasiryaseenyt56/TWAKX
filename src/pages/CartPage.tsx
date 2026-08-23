import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { PAKISTAN_CITIES } from '../lib/mockData';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    shippingFee,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingProgress,
    setCurrentPage,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [selectedCity, setSelectedCity] = useState('Karachi');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const freeShippingDifference = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our collection of earbuds, smartwatches, cables, and fast chargers to add items to your cart.
        </p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-8 py-3 rounded-full transition-colors inline-block"
        >
          Explore Shop Catalog →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your accessories, apply promotional coupons, and proceed to checkout.
        </p>
      </div>

      {/* Free Shipping Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
        <div className="flex items-center justify-between font-bold text-amber-950 mb-1.5">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            {freeShippingDifference === 0
              ? '🎉 Congratulations! You have unlocked FREE Shipping across Pakistan!'
              : `Add ₨ ${freeShippingDifference.toLocaleString()} more to qualify for FREE Delivery!`}
          </span>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-amber-200/80 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Cart Table + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4 text-center">Unit Price</th>
                  <th className="py-3.5 px-4 text-center">Quantity</th>
                  <th className="py-3.5 px-4 text-right">Subtotal</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.filter((item) => item?.product).map((item) => {
                  const unitPrice = item.product.salePrice ?? item.product.price ?? 0;
                  const lineTotal = unitPrice * item.quantity;
                  const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';
                  return (
                    <tr key={item.product.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={itemImg}
                            alt={item.product.name}
                            className="w-14 h-14 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Unit price */}
                      <td className="py-4 px-4 text-center font-mono font-medium text-slate-700">
                        ₨ {unitPrice.toLocaleString()}
                      </td>

                      {/* Quantity Stepper */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold text-slate-900 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Line subtotal */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                        ₨ {lineTotal.toLocaleString()}
                      </td>

                      {/* Remove */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>

            <button
              onClick={clearCart}
              className="text-rose-600 hover:underline font-semibold"
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right: Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          {/* Coupon Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Promotional Coupon
            </label>
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>
                    {appliedCoupon.code} (-₨ {discountAmount.toLocaleString()})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (e.g. TWAKX10)"
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-600 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && (
              <p
                className={`text-[11px] mt-1.5 font-medium ${
                  couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* City Delivery Estimator */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Delivery City (Pakistan)
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none"
            >
              {PAKISTAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city} (2-3 Days via TCS / Trax)
                </option>
              ))}
            </select>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Cart Subtotal:</span>
              <span className="font-semibold text-slate-900 font-mono">
                ₨ {cartSubtotal.toLocaleString()}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount:</span>
                <span className="font-mono">-₨ {discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Standard Courier Delivery:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₨ ${shippingFee.toLocaleString()}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-lg text-indigo-700 font-mono">
                ₨ {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Proceed to Checkout CTA */}
          <button
            onClick={() => {
              setCurrentPage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
