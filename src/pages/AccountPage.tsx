import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  User as UserIcon,
  Package,
  Printer,
  Heart,
  Search,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    user,
    isAdmin,
    orders,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    setCurrentPage,
    wishlist,
  } = useStore();

  // Auth Mode State (Sign In vs Register)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Order Lookup State
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (authMode === 'signup') {
      if (passwordInput !== confirmPasswordInput) {
        setAuthError('Passwords do not match. Please re-enter your password.');
        setAuthLoading(false);
        return;
      }
      const res = await signupWithEmail(nameInput, emailInput, passwordInput);
      if (!res.success && res.error) {
        setAuthError(res.error);
      }
    } else {
      const res = await loginWithEmail(emailInput, passwordInput);
      if (!res.success && res.error) {
        setAuthError(res.error);
      }
    }

    setAuthLoading(false);
  };

  const handleOrderLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    const clean = lookupOrderNumber.trim().replace(/^#/, '');
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean.toLowerCase() ||
        o.trackingNumber.toLowerCase() === clean.toLowerCase() ||
        o.customerPhone.includes(clean)
    );
    setSearchedOrder(found || null);
  };

  // Filter orders matching logged-in user
  const userOrders = user
    ? orders.filter(
        (o) =>
          (o.userId && o.userId === user.uid) ||
          (o.customerEmail && o.customerEmail.toLowerCase() === user.email?.toLowerCase())
      )
    : orders;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-20 space-y-8">
      {/* Customer Account & Authentication Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {user || isAdmin ? (
          /* Authenticated User Banner */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-indigo-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-xl font-bold text-slate-900">
                    {user?.displayName || 'Customer Account'}
                  </h1>
                  {isAdmin && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.email || 'Logged in to TWAKX Smart Accessories'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                onClick={logout}
                className="bg-slate-100 hover:bg-rose-50 text-rose-600 hover:border-rose-200 border border-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Customer Login / Register Flow */
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-slate-900">
                {authMode === 'signin' ? 'Welcome to TWAKX' : 'Create Your Account'}
              </h1>
              <p className="text-xs text-slate-500">
                {authMode === 'signin'
                  ? 'Sign in to access your order history, tracking, and wishlist'
                  : 'Register to manage orders, fast checkout, and receive delivery updates'}
              </p>
            </div>

            {/* Google Fast Sign-In */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-3 transition-all shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider shrink-0">
                Or with Email & Password
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-10 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs uppercase tracking-wider"
              >
                {authLoading ? (
                  <span>Processing...</span>
                ) : authMode === 'signin' ? (
                  <>
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Create TWAKX Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Toggle */}
            <div className="text-center pt-2">
              {authMode === 'signin' ? (
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError('');
                    }}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError('');
                    }}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Sign In here
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Lookup Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="max-w-xl">
          <span className="text-amber-400 text-[10px] font-black uppercase tracking-wider">
            Real-Time Courier Tracking
          </span>
          <h2 className="text-xl font-bold mt-1">Track Your Order Status</h2>
          <p className="text-xs text-slate-300 mt-1">
            Enter your 6-digit Order Number (e.g. 1001), Courier Tracking ID, or registered mobile phone number.
          </p>
        </div>

        <form onSubmit={handleOrderLookup} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            required
            value={lookupOrderNumber}
            onChange={(e) => setLookupOrderNumber(e.target.value)}
            placeholder="Order # (e.g. 1001 or 03XX-XXXXXXX)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 uppercase tracking-wider"
          >
            <Search className="w-4 h-4" />
            <span>Track Order</span>
          </button>
        </form>

        {searchAttempted && !searchedOrder && (
          <p className="text-xs text-rose-400 font-medium">
            No order found matching "{lookupOrderNumber}". Please verify your order number or phone.
          </p>
        )}

        {searchedOrder && (
          <div className="mt-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-white text-sm">
                  Order #{searchedOrder.orderNumber}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Tracking: {searchedOrder.trackingNumber}
                </span>
              </div>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded uppercase">
                {searchedOrder.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-700/80">
              <div>
                <span className="text-slate-400 text-[10px]">Recipient:</span>
                <p className="font-bold text-white">{searchedOrder.customerName}</p>
                <p className="text-slate-400 text-[11px]">{searchedOrder.city}, Pakistan</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Total Amount:</span>
                <p className="font-bold text-amber-400 font-mono text-sm">
                  ₨ {searchedOrder.total.toLocaleString()}
                </p>
                <p className="text-slate-400 text-[10px] uppercase">{searchedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(searchedOrder)}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders History List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Your Recent Orders History</h2>
          <span className="text-xs text-slate-500">{userOrders.length} orders on this device</span>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">You have not placed any orders yet.</p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-full"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {userOrders.map((o) => (
              <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-slate-900 text-sm">
                      #{o.orderNumber}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    • Tracking: <span className="font-mono text-indigo-600">{o.trackingNumber}</span>
                  </p>
                  <p className="text-slate-700 font-medium mt-1">
                    {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₨ {o.total.toLocaleString()}
                  </span>
                  <button
                    onClick={() => setSelectedInvoice(o)}
                    className="bg-slate-900 hover:bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
};
