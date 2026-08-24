import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  UserProfile,
  StoreSettings,
  Coupon,
  Review,
  FilterState,
  ActivePage,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
} from '../lib/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  firebaseSignOut,
  onAuthStateChanged,
  FirebaseUser,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection,
} from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface StoreContextType {
  // Navigation & UI
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Catalog & Filters
  products: Product[];
  filteredProducts: Product[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];

  // Cart & Discounts
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartItemCount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
  freeShippingProgress: number;

  // Wishlist & Compare
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  compareList: string[]; // product IDs
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Checkout & Orders
  orders: Order[];
  currentOrder: Order | null;
  lastPlacedOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string, adminNotes?: string) => Promise<void>;

  // Auth & Profile
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, pass: string) => boolean;
  logout: () => Promise<void>;
  adminPinUnlocked: boolean;
  setAdminPinUnlocked: (unlocked: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Settings & Coupons
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  getProductReviews: (productId: string) => Review[];

  // Products CRUD (Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  clearAllOrders: () => Promise<void>;
  duplicateProduct: (product: Product) => Promise<Product>;
  toggleProductFeatured: (id: string) => Promise<void>;
  toggleProductBestSeller: (id: string) => Promise<void>;
  adjustProductStock: (id: string, delta: number) => Promise<void>;

  // Categories CRUD (Admin & Catalog)
  categories: Category[];
  addCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategoryImage: (id: string, newImageUrl: string) => Promise<void>;
  reorderCategories: (newCategories: Category[]) => Promise<void>;
  getCategoryProductCount: (categoryName: string) => number;

  // Utilities
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  generateWhatsAppOrderUrl: (order: Order) => string;
  generateQuickWhatsAppProductUrl: (product: Product, quantity?: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  brand: 'all',
  minPrice: 0,
  maxPrice: 25000,
  rating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'featured',
};

const ADMIN_EMAILS = [
  'nasiryaseen2011@gmail.com',
  'muhammadali7394@gmail.com',
];

const sanitizeProduct = (p: any): Product => ({
  id: p?.id || `twk-${Date.now()}`,
  name: p?.name || 'TWAKX Accessory',
  slug: p?.slug || (p?.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product'),
  sku: p?.sku || 'TWK-GEN-001',
  category: p?.category || 'Wireless Earbuds',
  brand: p?.brand || 'TWAKX',
  price: typeof p?.price === 'number' ? p.price : Number(p?.price) || 0,
  salePrice: p?.salePrice !== undefined && p?.salePrice !== null ? Number(p.salePrice) : undefined,
  stock: typeof p?.stock === 'number' ? p.stock : (p?.stock !== undefined ? Number(p.stock) : 10),
  images: Array.isArray(p?.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
  description: p?.description || '',
  shortDescription: p?.shortDescription || '',
  highlights: Array.isArray(p?.highlights) ? p.highlights : [],
  specs: p?.specs || {},
  rating: typeof p?.rating === 'number' ? p.rating : 5,
  reviewCount: typeof p?.reviewCount === 'number' ? p.reviewCount : 0,
  featured: Boolean(p?.featured ?? p?.isFeatured),
  bestSeller: Boolean(p?.bestSeller ?? p?.isBestSeller),
  newArrival: Boolean(p?.newArrival ?? p?.isNewArrival),
  onSale: Boolean(p?.onSale ?? (p?.salePrice && p.salePrice < p.price)),
  createdAt: p?.createdAt,
  updatedAt: p?.updatedAt,
});

const sanitizeCategory = (c: any): Category => ({
  id: c?.id || `cat-${Date.now()}`,
  name: c?.name || 'Category',
  slug: c?.slug || (c?.name ? c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'category'),
  icon: c?.icon || 'Sparkles',
  image: c?.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  description: c?.description || '',
  isFeatured: Boolean(c?.isFeatured ?? true),
  displayOrder: typeof c?.displayOrder === 'number' ? c.displayOrder : 0,
  createdAt: c?.createdAt,
  updatedAt: c?.updatedAt,
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Products, Categories & Settings
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('twakx_products');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(sanitizeProduct) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('twakx_categories');
      if (!saved) return INITIAL_CATEGORIES.map(sanitizeCategory);
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed.map(sanitizeCategory) : INITIAL_CATEGORIES.map(sanitizeCategory);
    } catch {
      return INITIAL_CATEGORIES.map(sanitizeCategory);
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('twakx_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('twakx_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('twakx_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('twakx_orders');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Cart, Wishlist, Compare
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('twakx_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && item.product && item.product.id)
        .map((item) => ({
          ...item,
          product: sanitizeProduct(item.product),
          quantity: Math.max(1, Number(item.quantity) || 1),
        }));
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('twakx_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('twakx_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTERS);

  // Auth & User
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminPinUnlocked, setAdminPinUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('twakx_admin_unlocked') === 'true';
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('twakx_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('twakx_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('twakx_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('twakx_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('twakx_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('twakx_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('twakx_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('twakx_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('twakx_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('twakx_admin_unlocked', adminPinUnlocked ? 'true' : 'false');
  }, [adminPinUnlocked]);

  // URL route parser for direct links, reloads, and 404 detection
  const parseUrlRoute = useCallback((productList: Product[]) => {
    if (typeof window === 'undefined') return;
    try {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      const pageKey = (params.get('page') || params.get('p') || hash || pathname).replace(/^\/+/, '');
      const prodId = params.get('id') || params.get('productId') || params.get('sku');
      const prodSlug = params.get('slug');

      const routeMap: Record<string, ActivePage> = {
        '': 'home',
        'home': 'home',
        'index': 'home',
        'index.html': 'home',
        'shop': 'shop',
        'products': 'shop',
        'catalog': 'shop',
        'product-detail': 'product-detail',
        'product': 'product-detail',
        'cart': 'cart',
        'checkout': 'checkout',
        'order-confirmation': 'order-confirmation',
        'order-success': 'order-confirmation',
        'wishlist': 'wishlist',
        'favorites': 'wishlist',
        'compare': 'compare',
        'account': 'account',
        'login': 'account',
        'profile': 'account',
        'admin': 'admin',
        'portal': 'admin',
        'about': 'about',
        'contact': 'contact',
        'faq': 'faqs',
        'faqs': 'faqs',
        'shipping-policy': 'shipping-policy',
        'shipping': 'shipping-policy',
        'refund-policy': 'refund-policy',
        'refund': 'refund-policy',
        'privacy-policy': 'privacy-policy',
        'privacy': 'privacy-policy',
        'terms': 'terms',
        'terms-and-conditions': 'terms',
        'blog': 'blog',
        'guides': 'blog',
        '404': 'not-found',
        'not-found': 'not-found',
      };

      if (prodId || prodSlug) {
        const found = productList.find(
          (p) =>
            (prodId && (p.id === prodId || p.sku.toLowerCase() === prodId.toLowerCase())) ||
            (prodSlug && p.slug === prodSlug)
        );
        if (found) {
          setSelectedProduct(found);
          setCurrentPage('product-detail');
          return;
        }
      }

      if (pageKey && routeMap[pageKey]) {
        setCurrentPage(routeMap[pageKey]);
      } else if (pathname && routeMap[pathname]) {
        setCurrentPage(routeMap[pathname]);
      } else if (pathname && pathname !== '' && !routeMap[pathname]) {
        setCurrentPage('not-found');
      }
    } catch {
      // Fallback to home
    }
  }, []);

  // Initial load route parser
  useEffect(() => {
    parseUrlRoute(products);

    const handlePopState = () => {
      parseUrlRoute(products);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseUrlRoute, products]);

  // Keep browser URL updated cleanly when navigating pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (currentPage === 'home') {
        url.searchParams.delete('page');
        url.searchParams.delete('id');
      } else if (currentPage === 'product-detail' && selectedProduct) {
        url.searchParams.set('page', 'product-detail');
        url.searchParams.set('id', selectedProduct.id);
      } else if (currentPage !== 'not-found' && currentPage !== '404') {
        url.searchParams.set('page', currentPage);
        url.searchParams.delete('id');
      }
      if (window.location.search !== url.search) {
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
      }
    } catch {
      // URL update fallback
    }
  }, [currentPage, selectedProduct]);

  // Auth listener and Firestore test
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Customer',
          photoURL: currentUser.photoURL || undefined,
          role: ADMIN_EMAILS.includes(currentUser.email || '') ? 'admin' : 'customer',
        });
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Firestore sync for Products
  useEffect(() => {
    try {
      const q = query(collection(db, 'products'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const firestoreProducts: Product[] = [];
          if (!snapshot.empty) {
            snapshot.forEach((docSnap) => {
              firestoreProducts.push(sanitizeProduct({ id: docSnap.id, ...docSnap.data() }));
            });
            setProducts(firestoreProducts);
          } else {
            // Check if there are local products saved in localStorage before setting empty
            try {
              const saved = localStorage.getItem('twakx_products');
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setProducts(parsed.map(sanitizeProduct));
                  return;
                }
              }
            } catch {
              // Ignore
            }
            setProducts([]);
          }
        },
        (error) => {
          console.warn('Products sync notice:', error);
        }
      );
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, []);

  // Firestore sync for Categories
  useEffect(() => {
    try {
      const q = query(collection(db, 'categories'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreCats: Category[] = [];
            snapshot.forEach((docSnap) => {
              firestoreCats.push(sanitizeCategory({ id: docSnap.id, ...docSnap.data() }));
            });
            if (firestoreCats.length > 0) {
              firestoreCats.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
              setCategories(firestoreCats);
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'categories');
        }
      );
      return () => unsubscribe();
    } catch {
      // Offline fallback
    }
  }, []);

  // Firestore sync for Orders
  useEffect(() => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const firestoreOrders: Order[] = [];
          if (!snapshot.empty) {
            snapshot.forEach((docSnap) => {
              firestoreOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
            });
          }
          setOrders(firestoreOrders);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsubscribe();
    } catch {
      // Fallback
    }
  }, []);

  // Admin Check
  const isAdmin =
    adminPinUnlocked ||
    (user !== null && ADMIN_EMAILS.includes(user.email || '')) ||
    userProfile?.role === 'admin';

  // Login / Logout
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        showToast(`Welcome back, ${result.user.displayName || 'Customer'}!`, 'success');
      }
    } catch (err: unknown) {
      const authError = err as { code?: string; message?: string };
      // Ignore user-initiated popup cancellations gracefully
      if (
        authError?.code === 'auth/popup-closed-by-user' ||
        authError?.code === 'auth/cancelled-popup-request' ||
        authError?.message?.includes('popup-closed-by-user') ||
        authError?.message?.includes('cancelled-popup-request')
      ) {
        // User closed or dismissed the Google sign-in window - no action needed
        return;
      }

      if (authError?.code === 'auth/popup-blocked') {
        showToast('Sign-in popup was blocked by your browser. Please allow popups and try again.', 'info');
        return;
      }

      if (authError?.code === 'auth/network-request-failed') {
        showToast('Network error during sign-in. Please check your connection and retry.', 'error');
        return;
      }

      console.warn('Google sign-in status:', authError?.message || authError);
      showToast('Sign-in could not be completed. Please try again.', 'info');
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Check if it matches admin credentials
    const isEmailAdmin =
      cleanEmail.toLowerCase() === 'muhammadali7394@gmail.com' ||
      cleanEmail.toLowerCase() === 'nasiryaseen2011@gmail.com' ||
      cleanEmail.toLowerCase() === 'admin' ||
      cleanEmail.toLowerCase() === 'admin@twakx.pk';

    const isPassAdmin =
      cleanPass === 'TWAKX Smart Accessories' ||
      cleanPass.toLowerCase() === 'twakx smart accessories' ||
      cleanPass === 'twakx2026' ||
      cleanPass === 'admin';

    if (isEmailAdmin && isPassAdmin) {
      loginAdmin(cleanEmail, cleanPass);
      return { success: true };
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (userCred?.user) {
        showToast(`Welcome back, ${userCred.user.displayName || userCred.user.email?.split('@')[0] || 'Customer'}!`, 'success');
        return { success: true };
      }
      return { success: true };
    } catch (err: unknown) {
      const authError = err as { code?: string; message?: string };
      let errorMsg = 'Invalid email or password. Please try again.';

      if (authError?.code === 'auth/user-not-found' || authError?.code === 'auth/wrong-password' || authError?.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password. Please check your credentials or create a new account.';
      } else if (authError?.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (authError?.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please wait a few minutes before trying again.';
      }

      return { success: false, error: errorMsg };
    }
  };

  const signupWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPass = pass.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      if (userCred?.user) {
        await updateProfile(userCred.user, {
          displayName: cleanName,
        });

        // Initialize user document in Firestore
        const newUserProfile: UserProfile = {
          uid: userCred.user.uid,
          email: cleanEmail,
          displayName: cleanName,
          role: 'customer',
        };
        setUserProfile(newUserProfile);
        try {
          await setDoc(doc(db, 'users', userCred.user.uid), newUserProfile);
        } catch {
          // Non-blocking
        }

        showToast(`Account created successfully! Welcome ${cleanName}.`, 'success');
        return { success: true };
      }
      return { success: true };
    } catch (err: unknown) {
      const authError = err as { code?: string; message?: string };
      let errorMsg = 'Could not create account. Please try again.';

      if (authError?.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please sign in instead.';
      } else if (authError?.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (authError?.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address format.';
      }

      return { success: false, error: errorMsg };
    }
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isEmailAdmin =
      cleanEmail === 'muhammadali7394@gmail.com' ||
      cleanEmail === 'nasiryaseen2011@gmail.com' ||
      cleanEmail === 'admin' ||
      cleanEmail === 'admin@twakx.pk';

    const isPassAdmin =
      cleanPass === 'TWAKX Smart Accessories' ||
      cleanPass.toLowerCase() === 'twakx smart accessories' ||
      cleanPass === 'twakx2026' ||
      cleanPass === 'admin';

    if (isEmailAdmin && isPassAdmin) {
      setAdminPinUnlocked(true);
      localStorage.setItem('twakx_admin_unlocked', 'true');
      setUserProfile({
        uid: 'admin-muhammad-ali',
        email: 'muhammadali7394@gmail.com',
        displayName: 'Muhammad Ali (Admin)',
        role: 'admin',
      });
      showToast('Admin Portal access granted! Welcome Muhammad Ali.', 'success');
      return true;
    } else {
      showToast('Invalid admin credentials. Check your email and password.', 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setAdminPinUnlocked(false);
      localStorage.removeItem('twakx_admin_unlocked');
      setUserProfile(null);
      showToast('Logged out successfully', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...userProfile, ...data } as UserProfile;
    setUserProfile(updated);
    try {
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      showToast('Profile updated', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    if (!item?.product) return sum;
    const unitPrice = item.product.salePrice ?? item.product.price ?? 0;
    return sum + unitPrice * (item.quantity || 1);
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const shippingFee =
    cartSubtotal === 0 || cartSubtotal >= settings.freeShippingThreshold
      ? 0
      : settings.standardShippingFee;

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Cart actions
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    if (!product) return;
    const safeProduct = sanitizeProduct(product);
    if (safeProduct.stock <= 0) {
      showToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }
    setCart((prev) => {
      const validPrev = prev.filter((item) => item && item.product);
      const existingIndex = validPrev.findIndex(
        (item) => item.product.id === safeProduct.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const updated = [...validPrev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          product: safeProduct,
          quantity: Math.min(newQty, safeProduct.stock),
        };
        return updated;
      } else {
        return [...validPrev, { product: safeProduct, quantity: Math.min(quantity, safeProduct.stock), selectedColor }];
      }
    });
    showToast(`Added ${safeProduct.name.slice(0, 30)}... to cart!`, 'success');
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev
        .filter((item) => item && item.product)
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.min(quantity, item.product.stock || 99) };
          }
          return item;
        })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item?.product && item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order of ₨ ${found.minOrderAmount.toLocaleString()} required for this coupon.`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied! Saved ₨ ${found.discountType === 'percentage' ? `${found.discountValue}%` : found.discountValue}`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const toggleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from compare list', 'info');
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 items at once.', 'error');
        return prev;
      }
      showToast('Added to compare list', 'success');
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Compare list cleared', 'info');
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  // Filter Products
  const resetFilters = () => {
    setFilterState(INITIAL_FILTERS);
  };

  const getFilteredProducts = (): Product[] => {
    return products.filter((p) => {
      if (filterState.searchQuery) {
        const queryLower = filterState.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(queryLower);
        const matchesCategory = p.category.toLowerCase().includes(queryLower);
        const matchesBrand = p.brand.toLowerCase().includes(queryLower);
        const matchesSku = p.sku.toLowerCase().includes(queryLower);
        if (!matchesName && !matchesCategory && !matchesBrand && !matchesSku) {
          return false;
        }
      }

      if (filterState.category !== 'all' && p.category.toLowerCase() !== filterState.category.toLowerCase()) {
        return false;
      }

      if (filterState.brand !== 'all' && p.brand.toLowerCase() !== filterState.brand.toLowerCase()) {
        return false;
      }

      const activePrice = p.salePrice ?? p.price;
      if (activePrice < filterState.minPrice || activePrice > filterState.maxPrice) {
        return false;
      }

      if (filterState.rating > 0 && p.rating < filterState.rating) {
        return false;
      }

      if (filterState.inStockOnly && p.stock <= 0) {
        return false;
      }

      if (filterState.onSaleOnly && !p.salePrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      switch (filterState.sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        case 'best-selling':
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  };

  // Orders
  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `TWK-${randomDigits}`;
    const id = `order-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt,
      trackingNumber: `TRX-${Date.now().toString().slice(-8)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();

    try {
      await setDoc(doc(db, 'orders', id), newOrder);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${id}`);
    }

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    trackingNumber?: string,
    adminNotes?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNumber ?? o.trackingNumber,
            adminNotes: adminNotes ?? o.adminNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        ...(trackingNumber ? { trackingNumber } : {}),
        ...(adminNotes ? { adminNotes } : {}),
        updatedAt: new Date().toISOString(),
      });
      showToast(`Order status updated to ${status.toUpperCase()}`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // WhatsApp generator functions
  const generateWhatsAppOrderUrl = (order: Order): string => {
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;

    const itemsSummary = order.items
      .map((item) => `• ${item.name} (Qty: ${item.quantity}) - ₨ ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const paymentLabel =
      order.paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : order.paymentMethod === 'easypaisa'
        ? `Easypaisa (${settings.easypaisaNumber} - ${settings.easypaisaAccountName})`
        : 'Cash on Delivery (COD)';

    const message = `Hello TWAKX,

I would like to order:

${itemsSummary}

Order Total: ₨ ${order.total.toLocaleString()}
Payment Method: ${paymentLabel}

Customer Details:
Name: ${order.customerName}
Phone: ${order.customerPhone}
WhatsApp: ${order.customerWhatsApp || order.customerPhone}
City: ${order.city}
Address: ${order.address}
${order.orderNotes ? `Notes: ${order.orderNotes}\n` : ''}
Order ID: ${order.orderNumber}
Tracking Code: ${order.trackingNumber}

Please confirm my order.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const generateQuickWhatsAppProductUrl = (product: Product, quantity = 1): string => {
    const phone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    const price = product.salePrice ?? product.price;

    const message = `Hello TWAKX,

I am interested in ordering:
Product: ${product.name}
SKU: ${product.sku}
Quantity: ${quantity}
Price: ₨ ${(price * quantity).toLocaleString()}

Please let me know if this item is in stock and how to complete my order.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Products CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `twk-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
      showToast('Product added successfully to catalog!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );

    try {
      await updateDoc(doc(db, 'products', id), {
        ...updatedFields,
        updatedAt: new Date().toISOString().split('T')[0],
      });
      showToast('Product updated successfully!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
      showToast('Product removed from catalog', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const clearAllProducts = async () => {
    setProducts([]);
    setCart([]);
    setWishlist([]);
    setCompareList([]);
    localStorage.setItem('twakx_products', '[]');
    localStorage.setItem('twakx_cart', '[]');
    localStorage.setItem('twakx_wishlist', '[]');
    localStorage.setItem('twakx_compare', '[]');

    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const promises = snap.docs.map((d) => deleteDoc(doc(db, 'products', d.id)));
        await Promise.all(promises);
      }
      showToast('All products deleted from database', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'products');
    }
  };

  const clearAllOrders = async () => {
    setOrders([]);
    localStorage.setItem('twakx_orders', '[]');
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const promises = snap.docs.map((d) => deleteDoc(doc(db, 'orders', d.id)));
        await Promise.all(promises);
      }
      showToast('All orders deleted from database', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'orders');
    }
  };

  const duplicateProduct = async (productToCopy: Product): Promise<Product> => {
    const randomSkuNum = Math.floor(100 + Math.random() * 900);
    const id = `twk-${Date.now()}`;
    const duplicated: Product = {
      ...productToCopy,
      id,
      name: `${productToCopy.name} (Copy)`,
      sku: `${productToCopy.sku}-C${randomSkuNum}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [duplicated, ...prev]);
    try {
      await setDoc(doc(db, 'products', id), duplicated);
      showToast(`Duplicated "${productToCopy.name.slice(0, 24)}..."`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }
    return duplicated;
  };

  const toggleProductFeatured = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updatedFeatured = !target.featured;
    await updateProduct(id, { featured: updatedFeatured });
  };

  const toggleProductBestSeller = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updatedHot = !target.bestSeller;
    await updateProduct(id, { bestSeller: updatedHot });
  };

  const adjustProductStock = async (id: string, delta: number) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    await updateProduct(id, { stock: newStock });
  };

  // Settings & Coupons
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
      showToast('Store settings saved', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/general');
    }
  };

  const addCoupon = async (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    try {
      await setDoc(doc(db, 'coupons', coupon.id), coupon);
      showToast(`Coupon ${coupon.code} created!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `coupons/${coupon.id}`);
    }
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'coupons', id));
      showToast('Coupon removed', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coupons/${id}`);
    }
  };

  // Reviews
  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // update product rating count
    const productReviews = reviews.filter((r) => r.productId === reviewData.productId);
    const newAvg = (
      (productReviews.reduce((sum, r) => sum + r.rating, 0) + reviewData.rating) /
      (productReviews.length + 1)
    ).toFixed(1);

    updateProduct(reviewData.productId, {
      rating: parseFloat(newAvg),
      reviewCount: (productReviews.length + 1),
    });

    try {
      await setDoc(doc(db, 'reviews', id), newRev);
      showToast('Thank you! Your verified review has been published.', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reviews/${id}`);
    }
  };

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Categories CRUD (Admin)
  const getCategoryProductCount = (categoryName: string): number => {
    if (!categoryName) return 0;
    const lower = categoryName.toLowerCase().trim();
    return products.filter((p) => p.category?.toLowerCase().trim() === lower).length;
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = slug || `cat-${Date.now()}`;
    const newCategory: Category = {
      ...categoryData,
      id,
      slug,
      displayOrder: categoryData.displayOrder ?? (categories.length + 1),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setCategories((prev) => [...prev, newCategory]);

    try {
      await setDoc(doc(db, 'categories', id), newCategory);
      showToast(`Category "${newCategory.name}" created successfully!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `categories/${id}`);
    }

    return newCategory;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const existing = categories.find((c) => c.id === id);
    const oldName = existing?.name;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    // If category name was renamed, update linked products so they stay linked!
    if (updates.name && oldName && updates.name !== oldName) {
      const updatedProducts = products.map((p) =>
        p.category === oldName ? { ...p, category: updates.name! } : p
      );
      setProducts(updatedProducts);
      const productsToUpdate = products.filter((p) => p.category === oldName);
      productsToUpdate.forEach((p) => {
        updateProduct(p.id, { category: updates.name });
      });
    }

    try {
      await updateDoc(doc(db, 'categories', id), {
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0],
      });
      showToast(`Category "${updates.name || existing?.name}" updated!`, 'success');
    } catch (err) {
      try {
        const fullCat = categories.find((c) => c.id === id);
        if (fullCat) {
          await setDoc(doc(db, 'categories', id), { ...fullCat, ...updates }, { merge: true });
          showToast(`Category updated!`, 'success');
        }
      } catch (fallbackErr) {
        handleFirestoreError(fallbackErr, OperationType.UPDATE, `categories/${id}`);
      }
    }
  };

  const updateCategoryImage = async (id: string, newImageUrl: string) => {
    await updateCategory(id, { image: newImageUrl });
  };

  const deleteCategory = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteDoc(doc(db, 'categories', id));
      showToast(`Category "${target?.name || id}" removed`, 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
    }
  };

  const reorderCategories = async (newCategories: Category[]) => {
    const ordered = newCategories.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));
    setCategories(ordered);
    ordered.forEach((cat) => {
      setDoc(doc(db, 'categories', cat.id), cat, { merge: true }).catch(() => null);
    });
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        products,
        filteredProducts: getFilteredProducts(),
        filterState,
        setFilterState,
        resetFilters,
        getFilteredProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingFee,
        freeShippingProgress,
        wishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        orders,
        currentOrder,
        lastPlacedOrder: currentOrder,
        setCurrentOrder,
        placeOrder,
        updateOrderStatus,
        user,
        userProfile,
        isAdmin,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        loginAdmin,
        logout,
        adminPinUnlocked,
        setAdminPinUnlocked,
        updateUserProfile,
        settings,
        updateSettings,
        coupons,
        addCoupon,
        deleteCoupon,
        reviews,
        addReview,
        getProductReviews,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        clearAllOrders,
        duplicateProduct,
        toggleProductFeatured,
        toggleProductBestSeller,
        adjustProductStock,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        updateCategoryImage,
        reorderCategories,
        getCategoryProductCount,
        toasts,
        showToast,
        removeToast,
        generateWhatsAppOrderUrl,
        generateQuickWhatsAppProductUrl,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
