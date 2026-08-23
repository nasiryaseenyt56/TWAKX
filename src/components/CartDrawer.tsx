import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  MessageCircle,
  Truck,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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
    settings,
    setCurrentPage,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleClose = () => setIsCartDrawerOpen(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    const result = applyCoupon(couponInput.trim());
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    handleClose();
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewFullCart = () => {
    handleClose();
    setCurrentPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeShippingDifference = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold tracking-wide">
                Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs">
            <div className="flex items-center justify-between font-bold text-amber-950 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                {freeShippingDifference === 0
                  ? '🎉 You unlocked FREE Shipping across Pakistan!'
                  : `Add ₨ ${freeShippingDifference.toLocaleString()} more for FREE Delivery!`}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/80 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our catalog of wireless earbuds, smartwatches, fast chargers, and smart accessories to start shopping.
                </p>
                <button
                  onClick={() => {
                    handleClose();
                    setCurrentPage('shop');
                  }}
                  className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors inline-block"
                >
                  Explore Catalog →
                </button>
              </div>
            ) : (
              cart.filter((item) => item?.product).map((item) => {
                const unitPrice = item.product.salePrice ?? item.product.price ?? 0;
                const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-colors bg-white"
                  >
                    <img
                      src={itemImg}
                      alt={item.product.name}
                      className="w-18 h-18 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 -mr-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SKU: {item.product.sku}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Line price */}
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            ₨ {(unitPrice * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              (₨ {unitPrice.toLocaleString()} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout CTAs */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
              {/* Coupon Code Section */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code} applied (-₨ {discountAmount.toLocaleString()})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline"
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
                      placeholder="Coupon (e.g. TWAKX10, FREESHIP)"
                      className="flex-1 text-xs bg-white rounded-xl px-3 py-2 border border-slate-200 uppercase outline-none focus:border-indigo-600 font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
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
                  <span>Standard Shipping:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₨ ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total (PKR):</span>
                  <span className="text-base text-indigo-700 font-mono">
                    ₨ {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  id="cart-drawer-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleViewFullCart}
                    className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors text-center"
                  >
                    View Cart Page
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold py-2.5 px-3 rounded-xl text-xs transition-colors text-center"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
