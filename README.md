# TWAKX Smart Accessories & Gadgets 🇵🇰

A modern, high-performance E-Commerce & Smart Accessories platform tailored for the Pakistani market. Built with React 18, TypeScript, Tailwind CSS, and Firebase Firestore/Auth.

---

## 🚀 Quick Start & Deployment

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Local Run
```bash
# Install dependencies
npm install

# Run the development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

---

## 🌐 SPA Direct Routing & Deployment Fixes (No More 404 on Reload)

When deploying Single-Page Applications (SPAs) to hosting platforms like **Netlify**, **Vercel**, **GitHub Pages**, or **Firebase Hosting**, refreshing a sub-path (e.g. `/shop`, `/product-detail`, `/admin`) can return a 404 error if server rewrite rules are not set. 

This repository includes pre-configured rewrite files:

1. **`netlify.toml`** & **`public/_redirects`**: Redirects all requests (`/*`) to `/index.html` with status `200`.
2. **`public/404.html`**: Fallback routing script for static hosts (GitHub Pages / surge.sh) that recovers the route and forwards to the app.
3. **`index.html`**: In-browser SPA URL parser that immediately resolves parameters like `?page=shop`, `?page=admin`, `?page=product-detail&id=TW-101`, or clean paths like `/shop` and `/account`.
4. **`src/pages/NotFoundPage.tsx`**: Custom in-app 404 page featuring an interactive search bar, category shortcuts, and a "Return to Home" button.

---

## 📄 Site Map & Page Directory Guide

All pages are located under `src/pages/`:

| Page Component | URL / Route Key | Purpose & Features |
| :--- | :--- | :--- |
| **`HomePage.tsx`** | `/`, `?page=home` | **Home Storefront**: Hero banner, featured smart accessories, flash sale countdown, category carousels, trusted Pakistani service badges (TCS/Trax, COD, Warranty), customer reviews. |
| **`ShopPage.tsx`** | `/shop`, `?page=shop` | **Catalog & Filtering**: Complete product catalog with real-time category filtering, brand filters, price sliders (PKR), sorting (price, rating, latest), and grid/list views. |
| **`ProductDetailPage.tsx`** | `/product-detail`, `?page=product-detail&id={id}` | **Product Details**: Multi-angle image gallery with thumbnail preview, zoom, technical specifications table, genuine warranty badge, customer review submission, direct WhatsApp one-click ordering, and related accessories. |
| **`CartPage.tsx`** | `/cart`, `?page=cart` | **Shopping Bag**: Item quantity adjustment, promo coupon code applier (e.g. `WELCOME10`, `TWAKX20`), Pakistani delivery fee calculator, and one-click checkout trigger. |
| **`CheckoutPage.tsx`** | `/checkout`, `?page=checkout` | **Pakistani Checkout**: Cash on Delivery (COD), Easypaisa (`03378018331` - Nighat Ali), JazzCash, Bank Alfalah / HBL direct transfer, Pakistani city selection (Karachi, Lahore, Islamabad, etc.), postal code, and order validation. |
| **`OrderConfirmationPage.tsx`** | `/order-confirmation`, `?page=order-confirmation` | **Order Success**: Order invoice receipt with tracking number (TCS / Trax), order item summary, printable receipt button, and direct WhatsApp customer support. |
| **`AdminPage.tsx`** | `/admin`, `?page=admin` | **Store Management Portal**: Product management with **Multi-Image Upload & Gallery Manager**, order status tracker, sales analytics, coupon generator, store setting controls, and PDF invoice generation. |
| **`AccountPage.tsx`** | `/account`, `?page=account` | **Customer & Admin Portal**: Customer login, registration, past order history, saved delivery addresses, profile management, and dedicated Admin Login gateway. |
| **`WishlistPage.tsx`** | `/wishlist`, `?page=wishlist` | **Saved Items**: Personal wishlist for customers to save items for future purchases and quick transfer to cart. |
| **`ComparePage.tsx`** | `/compare`, `?page=compare` | **Product Comparison**: Side-by-side technical specs, battery life, Bluetooth versions, and price comparisons of up to 4 items. |
| **`AboutPage.tsx`** | `/about`, `?page=about` | **About TWAKX**: Brand story, quality promise, mission to bring reliable smart gadgets and genuine audio accessories to Pakistan. |
| **`ContactPage.tsx`** | `/contact`, `?page=contact` | **Contact & Support**: Support query form, WhatsApp direct hotline (`03352732395`), official email (`muhammadali7394@gmail.com`), operating hours, and location info. |
| **`FaqPage.tsx`** | `/faqs`, `?page=faqs` | **Frequently Asked Questions**: Delivery times, COD payment methods, return & replacement policies, and warranty claim procedures. |
| **`ShippingPolicyPage.tsx`** | `/shipping-policy`, `?page=shipping-policy` | **Shipping & Delivery Policy**: TCS/Trax delivery times across Pakistan (Karachi 1-2 days, other cities 2-4 days), free shipping threshold rules. |
| **`RefundPolicyPage.tsx`** | `/refund-policy`, `?page=refund-policy` | **Warranty & Returns**: 7-day replacement warranty, claim process, and return conditions. |
| **`PrivacyPolicyPage.tsx`** | `/privacy-policy`, `?page=privacy-policy` | **Privacy Policy**: Customer data protection, secure checkout policies, and cookie usage. |
| **`TermsPage.tsx`** | `/terms`, `?page=terms` | **Terms of Service**: Store terms, order acceptance policies, pricing, and customer rights. |
| **`BlogPage.tsx`** | `/blog`, `?page=blog` | **Smart Gadget Guides**: Buying guides for ANC earbuds, GaN fast chargers, smartwatch battery care, and tech tips. |
| **`NotFoundPage.tsx`** | `/not-found`, `404` | **404 Error Page**: Friendly error screen with smart search input, quick category links, and "Back to Store" button. |

---

## 🔐 Admin Portal Access

The Admin Portal is accessible securely through the **Account / Login page** (`/account` or `/admin`):

- **Admin Email**: `muhammadali7394@gmail.com`
- **Admin Password**: `TWAKX Smart Accessories`
- **Support WhatsApp**: `03352732395`
- **Easypaisa Payment Account**: `03378018331` (Nighat Ali)

### Admin Features:
1. **Multi-Image Upload & Sequence Manager**:
   - Upload multiple images directly from your device (PNG, JPG, WebP) with instant Base64 preview.
   - Add image web URLs directly.
   - 1-Click popular Pakistani accessories preset images (Earbuds, Smart Watch, GaN Charger, Power Bank, Headphones, Cables, Gaming).
   - Reorder images with left/right arrows.
   - Designate any image as the **★ Primary Cover Photo** with 1 click.
2. **Order Management**: Filter by status (Pending, Processing, Shipped, Delivered, Cancelled), update order status, generate & print official PDF invoices.
3. **Discount & Coupon Engine**: Create custom coupon codes (`WELCOME10`, etc.) with percentage/fixed discounts and minimum order requirements.
4. **Store Settings**: Customize delivery charges, free delivery threshold, contact numbers, and store notices.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom responsive utilities
- **Icons**: `lucide-react`
- **Backend / DB**: Google Firebase Firestore & Authentication
- **Local Fallback**: LocalStorage fallback for seamless offline or demo functionality

---

## 📦 Deployment Instructions

### 1. Netlify
1. Push this repository to GitHub.
2. Connect your repository to Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. *The included `netlify.toml` and `public/_redirects` files will automatically handle all SPA routing.*

### 2. Vercel
1. Import repository on Vercel.
2. Framework Preset: `Vite`
3. Output Directory: `dist`
4. Root Directory: `./`

### 3. GitHub Pages
1. Build the app using `npm run build`.
2. The `public/404.html` file ensures that direct URLs and reloads route back to `index.html` with full state preservation.

---

© 2026 **TWAKX Smart Accessories & Gadgets**. All Rights Reserved.
