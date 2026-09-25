export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  price: number; // Regular price in PKR
  salePrice?: number | null; // Discounted price in PKR
  stock: number;
  images: string[];
  description: string;
  shortDescription: string;
  highlights: string[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image: string;
  description?: string;
  isFeatured?: boolean;
  featured?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  selectedColor?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'cod'
  | 'easypaisa'
  | 'jazzcash'
  | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerWhatsApp?: string;
  customerEmail?: string;
  city: string;
  customerCity?: string;
  province?: string;
  address: string;
  customerAddress?: string;
  postalCode?: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus?: string;
  status: OrderStatus;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  address?: string;
  role?: 'admin' | 'customer';
  createdAt?: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  phoneNumber: string;
  supportEmail: string;
  easypaisaNumber: string;
  easypaisaAccountName: string;
  jazzcashNumber: string;
  jazzcashAccountName: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIBAN: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  announcementText: string;
  bannerActive: boolean;
  deliveryTimeEstimate: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  verified?: boolean;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'best-selling';
}

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-confirmation'
  | 'wishlist'
  | 'compare'
  | 'account'
  | 'admin'
  | 'about'
  | 'contact'
  | 'faq'
  | 'faqs'
  | 'shipping-policy'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms'
  | 'blog'
  | 'not-found'
  | '404';
