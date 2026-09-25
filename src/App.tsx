/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { FaqPage } from './pages/FaqPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { BlogPage } from './pages/BlogPage';

const AppContent: React.FC = () => {
  const { currentPage, toasts, removeToast } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Determine which page component to render
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
      case 'order-success':
        return <OrderConfirmationPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'refund-policy':
        return <RefundPolicyPage />;
      case 'privacy-policy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'blog':
        return <BlogPage />;
      case 'faq':
      case 'faqs':
        return <FaqPage />;
      case 'account':
        return <AccountPage />;
      case 'not-found':
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Content Router */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Pakistani WhatsApp Instant Support Widget */}
      <FloatingWhatsApp />

      {/* Floating Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in slide-in-from-top duration-150 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border-rose-800'
                : toast.type === 'info'
                ? 'bg-slate-900 text-slate-100 border-slate-800'
                : 'bg-emerald-900 text-emerald-50 border-emerald-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
