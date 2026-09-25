import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Coupon, StoreSettings, Category } from '../types';
import { AdminCategoriesTab } from '../components/AdminCategoriesTab';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings as SettingsIcon,
  Tag,
  Search,
  Eye,
  MessageCircle,
  Truck,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Save,
  Upload,
  Image as ImageIcon,
  Star,
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Check,
  Copy,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Info,
  Layers,
} from 'lucide-react';

type ProductModalStep = 'basic' | 'pricing' | 'images' | 'description' | 'badges';

export const AdminPage: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    clearAllOrders,
    duplicateProduct,
    toggleProductFeatured,
    toggleProductBestSeller,
    adjustProductStock,
    updateOrderStatus,
    updateSettings,
    addCoupon,
    deleteCoupon,
    isAdmin,
    loginAdmin,
    setSelectedProduct,
    setCurrentPage,
  } = useStore();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'settings'>('products');

  // Selected Order for Invoice
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // In-App Delete Confirmation Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showClearProductsModal, setShowClearProductsModal] = useState(false);
  const [showClearOrdersModal, setShowClearOrdersModal] = useState(false);
  const [isPurgingProducts, setIsPurgingProducts] = useState(false);
  const [isPurgingOrders, setIsPurgingOrders] = useState(false);

  // Stepped Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalStep, setModalStep] = useState<ProductModalStep>('basic');
  const [stepError, setStepError] = useState('');
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [newHighlightInput, setNewHighlightInput] = useState('');

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    brand: 'TWAKX',
    category: 'Wireless Earbuds',
    price: 2999,
    salePrice: 2499,
    sku: '',
    stock: 25,
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
    highlights: ['Premium Build Quality', '7-Day Replacement Warranty', 'Fast Dispatch'],
    specs: { 'Compatibility': 'iOS / Android / PC', 'Warranty': 'Official Brand Warranty' },
    rating: 4.9,
    reviewCount: 12,
    featured: true,
    bestSeller: false,
    newArrival: true,
  });

  // Inventory Table Search, Filter, Sort & Pagination
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('all');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [inventorySort, setInventorySort] = useState<'newest' | 'name' | 'price-low' | 'price-high' | 'stock-low' | 'stock-high'>('newest');
  const [inventoryPage, setInventoryPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Coupon Adding State
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 2000,
    isActive: true,
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Image Uploading & Manager State
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<string | null>(null);

  const ACCESSORY_PRESET_IMAGES = [
    { label: 'Wireless Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80' },
    { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
    { label: 'GaN 65W Fast Charger', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80' },
    { label: 'Power Bank 20000mAh', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80' },
    { label: 'ANC Over-Ear Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Braided Fast Cable', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80' },
    { label: 'RGB Gaming Headset', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80' },
    { label: 'Car Mount & Charger', url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80' },
  ];

  // Direct Image File Upload Handler with automatic client-side compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsImageUploading(true);
    setImageUploadStatus(`Optimizing and processing ${files.length} image(s)...`);

    const fileList: File[] = Array.from(files);
    const newOptimizedImages: string[] = [];

    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            const maxDimension = 1080;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve((ev.target?.result as string) || '');
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            resolve(compressed);
          };
          img.onerror = () => {
            resolve((ev.target?.result as string) || '');
          };
          img.src = (ev.target?.result as string) || '';
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    };

    try {
      for (const file of fileList) {
        const compressed = await compressImage(file);
        if (compressed) {
          newOptimizedImages.push(compressed);
        }
      }

      if (newOptimizedImages.length > 0) {
        setProductForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...newOptimizedImages],
        }));
        setImageUploadStatus(`✓ Uploaded ${newOptimizedImages.length} optimized image(s)!`);
      }
    } catch (err) {
      console.error('Image processing error:', err);
    } finally {
      setIsImageUploading(false);
      setTimeout(() => setImageUploadStatus(null), 3000);
      e.target.value = '';
    }
  };

  const handleAddCustomUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), trimmed],
    }));
    setCustomImageUrl('');
    setImageUploadStatus('✓ Image URL added to gallery!');
    setTimeout(() => setImageUploadStatus(null), 2500);
  };

  const handleRemoveImage = (index: number) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      current.splice(index, 1);
      return { ...prev, images: current };
    });
  };

  const handleSetPrimaryCover = (index: number) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      if (index <= 0 || index >= current.length) return prev;
      const [item] = current.splice(index, 1);
      current.unshift(item);
      return { ...prev, images: current };
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;
      return { ...prev, images: current };
    });
  };

  const handleAddPresetImage = (url: string) => {
    setProductForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), url],
    }));
  };

  const handleAddHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    setProductForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), trimmed],
    }));
    setNewHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setProductForm((prev) => {
      const current = [...(prev.highlights || [])];
      current.splice(index, 1);
      return { ...prev, highlights: current };
    });
  };

  const hasAccess = isAdmin || isUnlocked;

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(adminEmail, adminPass);
    if (success) {
      setIsUnlocked(true);
    } else {
      setLoginError('Invalid credentials. Please verify your admin email and password.');
    }
  };

  // Generate random SKU helper
  const generateSku = (categoryName: string) => {
    const prefix = categoryName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'TW');
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${randomNum}`;
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setModalStep('basic');
    setStepError('');
    setProductForm({
      name: '',
      brand: 'TWAKX',
      category: 'Wireless Earbuds',
      price: 2999,
      salePrice: 2499,
      sku: generateSku('Wireless Earbuds'),
      stock: 25,
      shortDescription: '',
      description: '',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
      highlights: ['Premium Build Quality', '7-Day Replacement Warranty', 'Fast Dispatch Across Pakistan'],
      specs: { 'Compatibility': 'iOS / Android / PC', 'Warranty': 'Official Brand Warranty' },
      rating: 4.9,
      reviewCount: 12,
      featured: true,
      bestSeller: false,
      newArrival: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setModalStep('basic');
    setStepError('');
    setProductForm({
      ...p,
      images: p.images && p.images.length > 0 ? [...p.images] : ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
      highlights: p.highlights ? [...p.highlights] : ['Official Brand Warranty', 'Fast Dispatch'],
    });
    setIsProductModalOpen(true);
  };

  const navigateToStep = (targetStep: ProductModalStep) => {
    if (targetStep !== 'basic' && (!productForm.name || !productForm.name.trim())) {
      setStepError('Please enter the accessory name / title first to proceed.');
      return;
    }
    setStepError('');
    setModalStep(targetStep);
  };

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSavingProduct) return;

    if (!productForm.name || !productForm.name.trim()) {
      setModalStep('basic');
      setStepError('Product title / accessory name is required before saving.');
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      setModalStep('pricing');
      setStepError('Please enter a valid regular price in PKR.');
      return;
    }

    // Set saving guard to prevent double-click creation
    setIsSavingProduct(true);

    const payload = {
      ...productForm,
      name: productForm.name.trim(),
      brand: productForm.brand?.trim() || 'TWAKX',
      category: productForm.category || 'Wireless Earbuds',
      price: Number(productForm.price),
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
      stock: Number(productForm.stock ?? 20),
      sku: productForm.sku?.trim() || generateSku(productForm.category || 'TW'),
      images: (productForm.images && productForm.images.length > 0)
        ? productForm.images
        : ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'],
      highlights: productForm.highlights && productForm.highlights.length > 0
        ? productForm.highlights
        : ['100% Original Brand Warranty', 'Fast Dispatch Across Pakistan'],
      shortDescription: productForm.shortDescription || `${productForm.name.trim()} - Official TWAKX Smart Accessories.`,
      description: productForm.description || `${productForm.name.trim()}. High quality tech gear engineered for high performance.`,
    };

    const isEdit = Boolean(editingProduct);
    const editId = editingProduct?.id;

    // Disappear / close modal immediately so user doesn't wait or click again
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setStepError('');

    try {
      if (isEdit && editId) {
        await updateProduct(editId, payload);
      } else {
        await addProduct(payload as any);
      }
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Inventory Table filtering & sorting
  const filteredInventory = useMemo(() => {
    return products.filter((p) => {
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesCat) return false;
      }
      if (inventoryCategory !== 'all' && p.category.toLowerCase() !== inventoryCategory.toLowerCase()) {
        return false;
      }
      if (inventoryStockFilter === 'in-stock' && p.stock <= 0) return false;
      if (inventoryStockFilter === 'low-stock' && (p.stock >= 5 || p.stock === 0)) return false;
      if (inventoryStockFilter === 'out-of-stock' && p.stock > 0) return false;
      return true;
    }).sort((a, b) => {
      if (inventorySort === 'name') return a.name.localeCompare(b.name);
      if (inventorySort === 'price-low') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      if (inventorySort === 'price-high') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      if (inventorySort === 'stock-low') return a.stock - b.stock;
      if (inventorySort === 'stock-high') return b.stock - a.stock;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [products, inventorySearch, inventoryCategory, inventoryStockFilter, inventorySort]);

  const totalInventoryPages = Math.max(1, Math.ceil(filteredInventory.length / itemsPerPage));
  const currentInventoryPage = Math.min(inventoryPage, totalInventoryPages);
  const paginatedInventory = filteredInventory.slice(
    (currentInventoryPage - 1) * itemsPerPage,
    currentInventoryPage * itemsPerPage
  );

  // Quick Action Handlers for Inventory
  const handleViewInStore = (p: Product) => {
    setSelectedProduct(p);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateProduct = async (p: Product) => {
    const copy = await duplicateProduct(p);
    if (copy) {
      handleOpenEditProduct(copy);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      const prodId = deletingProduct.id;
      setDeletingProduct(null);
      await deleteProduct(prodId);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) return;
    await addCoupon({
      code: couponForm.code.toUpperCase(),
      discountType: couponForm.discountType || 'percentage',
      discountValue: Number(couponForm.discountValue),
      minOrderAmount: Number(couponForm.minOrderAmount || 0),
      isActive: true,
    });
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      isActive: true,
    });
  };

  // Calculations for overview metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const inStockCount = products.filter((p) => p.stock > 0).length;

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-7 sm:p-8 space-y-6">
          <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">TWAKX Store Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your authorized admin credentials to manage store operations and product catalog.
            </p>
          </div>

          <form onSubmit={handleAdminUnlock} className="space-y-3.5 text-left">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@twakx.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-wider"
            >
              Sign In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              Admin Operations
            </span>
            <span className="text-xs text-slate-400">Store Management Console</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">TWAKX Smart Accessories</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin logged in: <span className="text-amber-300 font-mono font-medium">{adminEmail}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Store</span>
          </button>
          <button
            onClick={handleOpenAddProduct}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Add New Accessory</span>
          </button>
          <button
            onClick={() => setIsUnlocked(false)}
            className="bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          id="admin-tab-categories"
          onClick={() => setActiveTab('categories')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'coupons'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT INVENTORY (PRIMARY WORKSPACE) */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Catalog</span>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{products.length} Items</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">In Stock</span>
              <p className="text-xl font-black text-emerald-600 font-mono mt-0.5">{inStockCount} Items</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Low Stock (&lt;5)</span>
              <p className="text-xl font-black text-amber-600 font-mono mt-0.5">{lowStockCount} Items</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Out of Stock</span>
              <p className="text-xl font-black text-rose-600 font-mono mt-0.5">
                {products.filter((p) => p.stock <= 0).length} Items
              </p>
            </div>
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search accessory by title, SKU, brand, or category..."
                  value={inventorySearch}
                  onChange={(e) => {
                    setInventorySearch(e.target.value);
                    setInventoryPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
                {inventorySearch && (
                  <button
                    onClick={() => setInventorySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {products.length > 0 && (
                  <button
                    onClick={() => setShowClearProductsModal(true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-rose-200 shadow-xs transition-colors shrink-0"
                    title="Delete all products from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Products</span>
                  </button>
                )}

                {/* Add Accessory Button */}
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Accessory</span>
                </button>
              </div>
            </div>

            {/* Filter Pills / Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Category Filter */}
              <select
                value={inventoryCategory}
                onChange={(e) => {
                  setInventoryCategory(e.target.value);
                  setInventoryPage(1);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium text-xs cursor-pointer outline-none"
              >
                <option value="all">All Categories</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={inventoryStockFilter}
                onChange={(e) => {
                  setInventoryStockFilter(e.target.value as any);
                  setInventoryPage(1);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium text-xs cursor-pointer outline-none"
              >
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock (&gt;0)</option>
                <option value="low-stock">Low Stock (&lt;5)</option>
                <option value="out-of-stock">Out of Stock (0)</option>
              </select>

              {/* Sort Order */}
              <select
                value={inventorySort}
                onChange={(e) => setInventorySort(e.target.value as any)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium text-xs cursor-pointer outline-none ml-auto"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="price-low">Sort: Price (Low → High)</option>
                <option value="price-high">Sort: Price (High → Low)</option>
                <option value="stock-low">Sort: Stock (Low → High)</option>
                <option value="stock-high">Sort: Stock (High → Low)</option>
              </select>
            </div>
          </div>

          {/* Product Inventory Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Item & Info</th>
                    <th className="py-3.5 px-3">Category</th>
                    <th className="py-3.5 px-3">Regular Price</th>
                    <th className="py-3.5 px-3">Sale Price</th>
                    <th className="py-3.5 px-3">Stock Units</th>
                    <th className="py-3.5 px-3 text-center">Badges</th>
                    <th className="py-3.5 px-4 text-right">Actions & Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-600">No accessories match your filters</p>
                        <p className="text-[11px] mt-0.5">Try changing your search query or reset filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInventory.map((p) => {
                      const isLow = p.stock < 5 && p.stock > 0;
                      const isOut = p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Item & Info */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                <img
                                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                                {(p.images?.length || 0) > 1 && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded">
                                    {p.images?.length}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 cursor-pointer" onClick={() => handleOpenEditProduct(p)}>
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  SKU: <span className="text-slate-600 font-semibold">{p.sku}</span> | Brand: {p.brand}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                              {p.category}
                            </span>
                          </td>

                          {/* Regular Price */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            ₨ {p.price.toLocaleString()}
                          </td>

                          {/* Sale Price */}
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600">
                            {p.salePrice ? (
                              <div className="flex items-center gap-1">
                                <span>₨ {p.salePrice.toLocaleString()}</span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                                  {Math.round(((p.price - p.salePrice) / p.price) * 100)}% OFF
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-normal">—</span>
                            )}
                          </td>

                          {/* Stock Units & Quick Adjuster */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded text-xs inline-block ${
                                  isOut
                                    ? 'bg-rose-100 text-rose-800'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stock} pcs
                              </span>

                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => adjustProductStock(p.id, -1)}
                                  disabled={p.stock <= 0}
                                  className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center disabled:opacity-30"
                                  title="Decrease Stock (-1)"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => adjustProductStock(p.id, 5)}
                                  className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center"
                                  title="Add Stock (+5)"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Badges & Flags */}
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => toggleProductFeatured(p.id)}
                                className={`p-1 rounded transition-colors ${
                                  p.featured
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-400 hover:text-amber-600'
                                }`}
                                title={p.featured ? 'Featured (Click to disable)' : 'Mark as Featured'}
                              >
                                <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                              </button>

                              <button
                                onClick={() => toggleProductBestSeller(p.id)}
                                className={`p-1 rounded transition-colors ${
                                  p.bestSeller
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-slate-100 text-slate-400 hover:text-rose-600'
                                }`}
                                title={p.bestSeller ? 'Hot Item (Click to disable)' : 'Mark as Hot'}
                              >
                                <Flame className={`w-3.5 h-3.5 ${p.bestSeller ? 'fill-rose-500' : ''}`} />
                              </button>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                title="Edit Product Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              {/* View in Public Store */}
                              <button
                                onClick={() => handleViewInStore(p)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                title="View in Store Page"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Duplicate Product */}
                              <button
                                onClick={() => handleDuplicateProduct(p)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                title="Duplicate this Item"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => setDeletingProduct(p)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Summary Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-800">{filteredInventory.length > 0 ? (currentInventoryPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
                <span className="font-bold text-slate-800">
                  {Math.min(currentInventoryPage * itemsPerPage, filteredInventory.length)}
                </span>{' '}
                of <span className="font-bold text-slate-800">{filteredInventory.length}</span> accessories
                {filteredInventory.length !== products.length && ` (filtered from ${products.length} total)`}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-2 text-[11px] text-slate-500">
                  <span>Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setInventoryPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={100}>All</option>
                  </select>
                </div>

                <button
                  disabled={currentInventoryPage <= 1}
                  onClick={() => setInventoryPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-mono font-bold text-slate-800">
                  {currentInventoryPage} / {totalInventoryPages}
                </span>

                <button
                  disabled={currentInventoryPage >= totalInventoryPages}
                  onClick={() => setInventoryPage((p) => Math.min(totalInventoryPages, p + 1))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">
              Customer Orders ({orders.length} Total)
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search by order #, customer, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="pending">Pending ({orders.filter((o) => o.status === 'pending').length})</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {orders.length > 0 && (
                <button
                  onClick={() => setShowClearOrdersModal(true)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-rose-200 shadow-xs transition-colors"
                  title="Delete all orders from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Orders</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">No orders recorded yet</p>
                <p className="text-xs mt-1">When customers place orders, they will appear here in real-time.</p>
              </div>
            ) : (
              orders
                .filter((o) => {
                  if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                  if (orderSearch.trim()) {
                    const q = orderSearch.toLowerCase();
                    const matchesNum = o.orderNumber?.toLowerCase().includes(q);
                    const matchesName = o.customerName?.toLowerCase().includes(q);
                    const matchesPhone = o.customerPhone?.toLowerCase().includes(q);
                    const matchesCity = (o.customerCity || o.city || '')?.toLowerCase().includes(q);
                    if (!matchesNum && !matchesName && !matchesPhone && !matchesCity) return false;
                  }
                  return true;
                })
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-900 text-sm">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              order.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : order.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'shipped'
                                ? 'bg-indigo-100 text-indigo-800'
                                : order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Placed: {order.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-slate-900 font-mono">
                          ₨ {order.total.toLocaleString()}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold uppercase">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Easypaisa'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Customer Details</h4>
                        <p className="font-semibold text-slate-800">{order.customerName}</p>
                        <p className="text-slate-600 font-mono">{order.customerPhone}</p>
                        <p className="text-slate-600">{order.customerEmail}</p>
                        <p className="text-slate-500 mt-1">{order.customerAddress || order.address}, {order.customerCity || order.city}</p>
                      </div>

                      {/* Items Ordered */}
                      <div className="md:col-span-2 space-y-2">
                        <h4 className="font-bold text-slate-900 mb-1">Items Ordered</h4>
                        <div className="divide-y divide-slate-100 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                          {order.items.map((item, idx) => {
                            const itemImg = (item as any).image || (item as any).product?.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80';
                            const itemName = (item as any).name || (item as any).product?.name || 'Product';
                            const itemPrice = (item as any).price ?? (item as any).product?.salePrice ?? (item as any).product?.price ?? 0;
                            return (
                              <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={itemImg}
                                    alt={itemName}
                                    className="w-8 h-8 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                                  />
                                  <span className="font-medium text-slate-800 truncate">
                                    {itemName}
                                  </span>
                                </div>
                                <span className="font-mono text-slate-600 shrink-0 ml-2">
                                  {item.quantity} × ₨ {itemPrice.toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Actions & WhatsApp Direct Connect */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <span>Print / View Invoice</span>
                        </button>
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                            order.customerName
                          )},%20this%20is%20TWAKX%20Smart%20Accessories%20regarding%20your%20order%20${
                            order.orderNumber
                          }.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OVERVIEW & SALES ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Revenue</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                  ₨ {totalRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">Active store sales</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200/60">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Orders</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{totalOrdersCount}</p>
                <p className="text-[10px] text-indigo-600 font-semibold mt-1">{pendingOrdersCount} pending action</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200/60">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Catalog Products</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">{products.length}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Live in store</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Low Stock Alerts</p>
                <p className="text-2xl font-black text-rose-600 font-mono mt-1">{lowStockCount}</p>
                <p className="text-[10px] text-rose-500 font-semibold mt-1">Items &lt; 5 units</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <AdminCategoriesTab
          onNavigateToProductsWithCategory={(catName) => {
            setInventoryCategory(catName);
            setActiveTab('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* TAB 4: COUPONS MANAGER */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Create New Promo Coupon
            </h3>
            <form onSubmit={handleAddCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. TWAKX20"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                <select
                  value={couponForm.discountType}
                  onChange={(e) =>
                    setCouponForm({
                      ...couponForm,
                      discountType: e.target.value as 'percentage' | 'fixed',
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed">Fixed Amount (₨ PKR)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={couponForm.discountValue}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Minimum Order Requirement (₨)
                </label>
                <input
                  type="number"
                  value={couponForm.minOrderAmount}
                  onChange={(e) =>
                    setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl transition-colors"
              >
                Add Promo Coupon
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Store Coupons ({coupons.length})
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {coupons.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      {c.code}
                    </span>
                    <span className="ml-2 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `₨ ${c.discountValue} OFF`}
                    </span>
                    {c.minOrderAmount && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Min. Order: ₨ {c.minOrderAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Store Configuration & Payment Accounts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your Pakistani contact numbers, Easypaisa details, and top announcement banner.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
              ✓ Store settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  WhatsApp Support Number
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Call Phone Number</label>
                <input
                  type="text"
                  value={settingsForm.phoneNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Free Shipping Min. (₨)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Easypaisa Account Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Easypaisa Account Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.easypaisaNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, easypaisaNumber: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Account Title / Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.easypaisaAccountName}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        easypaisaAccountName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Top Announcement Bar
              </h4>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors uppercase tracking-wider text-xs"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP-BY-STEP ADD / EDIT ACCESSORY MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
            onClick={() => setIsProductModalOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-6 max-h-[90vh] flex flex-col">
            {/* Modal Header with Title and Quick Save Button */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                  {editingProduct ? 'Edit Catalog Item' : 'New Accessory Setup'}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Smart Accessory'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => handleSaveProduct()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  title="Save and publish instantly"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingProduct ? 'Save' : 'Save & Publish'}</span>
                </button>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => navigateToStep('basic')}
                className={`py-3 px-4 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  modalStep === 'basic'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>1. Title & Details</span>
                {productForm.name?.trim() && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>

              <button
                type="button"
                onClick={() => navigateToStep('pricing')}
                className={`py-3 px-4 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  modalStep === 'pricing'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>2. Price & Stock</span>
                {Boolean(productForm.price) && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>

              <button
                type="button"
                onClick={() => navigateToStep('images')}
                className={`py-3 px-4 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  modalStep === 'images'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>3. Photos ({productForm.images?.length || 0})</span>
                {Boolean(productForm.images?.length) && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>

              <button
                type="button"
                onClick={() => navigateToStep('description')}
                className={`py-3 px-4 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  modalStep === 'description'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>4. Features & Highlights</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToStep('badges')}
                className={`py-3 px-4 flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors ${
                  modalStep === 'badges'
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>5. Badges & Review</span>
              </button>
            </div>

            {/* Step Error Notice */}
            {stepError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* STEP 1: BASIC INFO & NAME */}
              {modalStep === 'basic' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-indigo-900">Step 1: Enter Product Title First</p>
                      <p className="text-[11px] text-indigo-700 mt-0.5">
                        Start by writing the accessory name and selecting its category. You can then configure pricing, upload multiple photos, and set specifications in the next steps.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-900 block mb-1 text-xs">
                      Product Title / Accessory Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. TWAKX M10 Wireless Bluetooth Earbuds 5.3 with Power Bank"
                      value={productForm.name || ''}
                      onChange={(e) => {
                        setProductForm({ ...productForm, name: e.target.value });
                        if (stepError) setStepError('');
                      }}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl p-3.5 text-sm font-bold text-slate-900 outline-none transition-all shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter a clear descriptive title that customers can search for.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Category <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={productForm.category || (categories?.[0]?.name || 'Wireless Earbuds')}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setProductForm({
                            ...productForm,
                            category: cat,
                            sku: productForm.sku || generateSku(cat),
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
                      >
                        {(categories || []).map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brand</label>
                      <input
                        type="text"
                        value={productForm.brand || 'TWAKX'}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 text-xs">SKU / Model ID</label>
                        <button
                          type="button"
                          onClick={() =>
                            setProductForm({
                              ...productForm,
                              sku: generateSku(productForm.category || 'TW'),
                            })
                          }
                          className="text-[10px] text-indigo-600 hover:underline font-bold"
                        >
                          Auto-Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={productForm.sku || ''}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PRICING & STOCK */}
              {modalStep === 'pricing' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Regular Price (₨ PKR) <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₨</span>
                        <input
                          type="number"
                          required
                          min={1}
                          value={productForm.price || ''}
                          onChange={(e) =>
                            setProductForm({ ...productForm, price: Number(e.target.value) })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 font-mono font-bold text-sm"
                        />
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {[1500, 2500, 3500, 5000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, price: preset })}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded"
                          >
                            ₨ {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Discount / Sale Price (₨ PKR - Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₨</span>
                        <input
                          type="number"
                          value={productForm.salePrice || ''}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              salePrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-3 font-mono font-bold text-sm text-indigo-700"
                        />
                      </div>
                      {productForm.salePrice && productForm.price && productForm.salePrice < productForm.price && (
                        <p className="text-[11px] text-emerald-600 font-bold mt-1">
                          ✓ Discount: {Math.round(((productForm.price - productForm.salePrice) / productForm.price) * 100)}% OFF (Customer saves ₨ {(productForm.price - productForm.salePrice).toLocaleString()})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="font-bold text-slate-700 block mb-1">
                      Available Stock Quantity (Units) <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        required
                        value={productForm.stock ?? 20}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stock: Number(e.target.value) })
                        }
                        className="w-32 bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-sm"
                      />
                      <div className="flex gap-1.5">
                        {[5, 10, 25, 50, 100].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setProductForm({ ...productForm, stock: num })}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl"
                          >
                            {num} pcs
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MULTI-IMAGE UPLOAD & GALLERY */}
              {modalStep === 'images' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        Product Gallery Images ({productForm.images?.length || 0})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Upload direct pictures or add web URLs. The first image in the sequence is your <strong>Primary Cover Photo</strong>.
                      </p>
                    </div>
                    {productForm.images && productForm.images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, images: [] })}
                        className="text-[11px] text-rose-600 hover:underline font-semibold"
                      >
                        Clear All Photos
                      </button>
                    )}
                  </div>

                  {/* Device Upload and URL Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Device Upload Zone */}
                    <label className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform mb-1.5" />
                      <span className="font-bold text-slate-900 text-xs block">
                        {isImageUploading ? 'Uploading Files...' : 'Upload Photos From Device'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Select single or multiple JPG, PNG, WebP
                      </span>
                    </label>

                    {/* URL Input Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Or Paste Image URL</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomUrl}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {imageUploadStatus && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{imageUploadStatus}</span>
                    </div>
                  )}

                  {/* Quick Accessory Presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Quick Accessories Sample Presets (Click to add)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ACCESSORY_PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPresetImage(preset.url)}
                          className="text-[10px] bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg font-medium transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gallery Sequence */}
                  {productForm.images && productForm.images.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Gallery Photos (Click ★ to set as Cover):</span>
                        <span className="text-[10px] text-slate-400">Order from left to right</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                        {productForm.images.map((imgUrl, index) => (
                          <div
                            key={index}
                            className={`relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-100 group transition-all ${
                              index === 0
                                ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md'
                                : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                <span>PRIMARY COVER</span>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                              <div className="flex justify-between items-center">
                                {index > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryCover(index)}
                                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
                                    title="Make Primary Cover Image"
                                  >
                                    <Star className="w-3 h-3 fill-slate-950" />
                                    <span>Set Cover</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-white font-bold">Cover Photo</span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="bg-rose-600 hover:bg-rose-500 text-white p-1 rounded-md"
                                  title="Delete Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex justify-center gap-2">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, 'left')}
                                    className="bg-white/90 hover:bg-white text-slate-900 p-1.5 rounded-lg"
                                    title="Move Earlier"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {index < (productForm.images?.length || 0) - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, 'right')}
                                    className="bg-white/90 hover:bg-white text-slate-900 p-1.5 rounded-lg"
                                    title="Move Later"
                                  >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400">
                      No pictures in gallery yet. Please upload files or select sample presets above.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: FEATURES & DESCRIPTION */}
              {modalStep === 'description' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Short Tagline / Summary (Displayed on product cards)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wireless Bluetooth 5.3 earbuds with 2000mAh digital LED power bank case"
                      value={productForm.shortDescription || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, shortDescription: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                    />
                  </div>

                  {/* Bullet Highlights Manager */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block text-xs">
                      Key Highlights & Warranty Bullet Points
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 7-Day Replacement Warranty, Fast Charging"
                        value={newHighlightInput}
                        onChange={(e) => setNewHighlightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="bg-slate-900 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {productForm.highlights?.map((h, i) => (
                        <span
                          key={i}
                          className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{h}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(i)}
                            className="text-indigo-400 hover:text-rose-600 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Full Product Description (Detailed specifications, usage guide, etc.)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write in-depth specifications, build quality, warranty terms, and battery performance..."
                      value={productForm.description || ''}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: BADGES & REVIEW */}
              {modalStep === 'badges' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      Display Badges & Store Promotion
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        productForm.featured
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 text-xs">Featured Product</span>
                          <input
                            type="checkbox"
                            checked={Boolean(productForm.featured)}
                            onChange={(e) =>
                              setProductForm({ ...productForm, featured: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-indigo-600"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Showcase in the top Featured row on homepage.
                        </p>
                      </label>

                      <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        productForm.bestSeller
                          ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 text-xs">Hot Best Seller</span>
                          <input
                            type="checkbox"
                            checked={Boolean(productForm.bestSeller)}
                            onChange={(e) =>
                              setProductForm({ ...productForm, bestSeller: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-amber-600"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Adds prominent HOT flame badge on cards.
                        </p>
                      </label>

                      <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        productForm.newArrival
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 text-xs">New Arrival</span>
                          <input
                            type="checkbox"
                            checked={Boolean(productForm.newArrival)}
                            onChange={(e) =>
                              setProductForm({ ...productForm, newArrival: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-emerald-600"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Highlighted in the New Arrivals collection.
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Live Card Preview Box */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Live Store Card Preview
                    </h4>
                    <div className="max-w-xs bg-white rounded-2xl border border-slate-200 p-3 shadow-md">
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                        <img
                          src={productForm.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        {productForm.featured && (
                          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                        {productForm.bestSeller && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                            HOT
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-indigo-600 font-bold uppercase">{productForm.category || 'Category'}</p>
                      <p className="font-bold text-slate-900 line-clamp-1">{productForm.name || 'Your Product Title'}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-black font-mono text-slate-900">
                          ₨ {(productForm.salePrice || productForm.price || 0).toLocaleString()}
                        </span>
                        {productForm.salePrice && (
                          <span className="text-[10px] text-slate-400 line-through font-mono">
                            ₨ {(productForm.price || 0).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Stepper Bar */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {modalStep !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (modalStep === 'pricing') navigateToStep('basic');
                      if (modalStep === 'images') navigateToStep('pricing');
                      if (modalStep === 'description') navigateToStep('images');
                      if (modalStep === 'badges') navigateToStep('description');
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}

                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      const toDelete = editingProduct;
                      setIsProductModalOpen(false);
                      setEditingProduct(null);
                      setDeletingProduct(toDelete);
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                    title="Delete this product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => handleSaveProduct()}
                  className="px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingProduct ? 'Save Changes' : 'Save & Publish'}</span>
                </button>

                {modalStep !== 'badges' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (modalStep === 'basic') navigateToStep('pricing');
                      else if (modalStep === 'pricing') navigateToStep('images');
                      else if (modalStep === 'images') navigateToStep('description');
                      else if (modalStep === 'description') navigateToStep('badges');
                    }}
                    className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setDeletingProduct(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Remove Accessory from Store?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this product? This will remove it from the catalog and customer view.
              </p>
            </div>

            {/* Product Card Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={deletingProduct.images?.[0] || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'}
                alt={deletingProduct.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-bold text-slate-900 text-xs line-clamp-1">{deletingProduct.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">SKU: {deletingProduct.sku} | ₨ {deletingProduct.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP CLEAR ALL PRODUCTS CONFIRMATION MODAL */}
      {showClearProductsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => !isPurgingProducts && setShowClearProductsModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Remove All Products from Database?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete all <strong className="text-slate-900">{products.length}</strong> products from the database? This action is permanent and clears all catalog inventory.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={isPurgingProducts}
                onClick={() => setShowClearProductsModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPurgingProducts}
                onClick={async () => {
                  setIsPurgingProducts(true);
                  try {
                    await clearAllProducts();
                    setShowClearProductsModal(false);
                  } finally {
                    setIsPurgingProducts(false);
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                {isPurgingProducts ? 'Deleting...' : 'Delete All Products'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP CLEAR ALL ORDERS CONFIRMATION MODAL */}
      {showClearOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => !isPurgingOrders && setShowClearOrdersModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Remove All Orders from Database?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete all <strong className="text-slate-900">{orders.length}</strong> orders from the database? This action is permanent and removes all customer order histories.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                disabled={isPurgingOrders}
                onClick={() => setShowClearOrdersModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPurgingOrders}
                onClick={async () => {
                  setIsPurgingOrders(true);
                  try {
                    await clearAllOrders();
                    setShowClearOrdersModal(false);
                  } finally {
                    setIsPurgingOrders(false);
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                {isPurgingOrders ? 'Deleting...' : 'Delete All Orders'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal for Admin */}
      {invoiceOrder && (
        <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </div>
  );
};
