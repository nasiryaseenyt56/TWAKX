import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Search,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Upload,
  AlertTriangle,
  ExternalLink,
  Package,
  Layers,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORY_PRESET_IMAGES = [
  {
    label: 'Wireless Earbuds',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Smart Watches',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Headphones & Audio',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fast Chargers & Adapters',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Power Banks',
    url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Braided Fast Cables',
    url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Gaming Accessories',
    url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Laptop Hubs & Stands',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Mobile Cases & Covers',
    url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Car Chargers & Mounts',
    url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bluetooth Speakers',
    url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Screen Protectors & Glass',
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
  },
];

interface AdminCategoriesTabProps {
  onNavigateToProductsWithCategory?: (categoryName: string) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  onNavigateToProductsWithCategory,
}) => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    updateCategoryImage,
    reorderCategories,
    getCategoryProductCount,
    setFilterState,
    setCurrentPage,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Full Create/Edit Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    slug: string;
    image: string;
    description: string;
    featured: boolean;
    displayOrder: number;
  }>({
    name: '',
    slug: '',
    image: CATEGORY_PRESET_IMAGES[0].url,
    description: '',
    featured: true,
    displayOrder: 1,
  });
  const [modalError, setModalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Quick Image Change Modal State
  const [imageChangeCategory, setImageChangeCategory] = useState<Category | null>(null);
  const [quickImageUrl, setQuickImageUrl] = useState('');
  const [isQuickImageSaving, setIsQuickImageSaving] = useState(false);

  // In-App Delete Confirmation Modal
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Image Upload File Handler
  const handleCategoryFormFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCategoryForm((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setQuickImageUrl(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      image: CATEGORY_PRESET_IMAGES[0].url,
      description: '',
      featured: true,
      displayOrder: (categories?.length || 0) + 1,
    });
    setModalError('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug || generateSlug(cat.name),
      image: cat.image || CATEGORY_PRESET_IMAGES[0].url,
      description: cat.description || '',
      featured: cat.isFeatured ?? cat.featured ?? true,
      displayOrder: cat.displayOrder ?? 1,
    });
    setModalError('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenQuickImageModal = (cat: Category) => {
    setImageChangeCategory(cat);
    setQuickImageUrl(cat.image || CATEGORY_PRESET_IMAGES[0].url);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setModalError('Category title is required.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    try {
      const finalSlug = categoryForm.slug.trim() || generateSlug(categoryForm.name);

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryForm.name.trim(),
          slug: finalSlug,
          image: categoryForm.image.trim() || CATEGORY_PRESET_IMAGES[0].url,
          description: categoryForm.description.trim(),
          featured: categoryForm.featured,
          isFeatured: categoryForm.featured,
          displayOrder: Number(categoryForm.displayOrder) || 1,
        });
      } else {
        await addCategory({
          name: categoryForm.name.trim(),
          slug: finalSlug,
          image: categoryForm.image.trim() || CATEGORY_PRESET_IMAGES[0].url,
          description: categoryForm.description.trim(),
          featured: categoryForm.featured,
          isFeatured: categoryForm.featured,
          displayOrder: Number(categoryForm.displayOrder) || (categories?.length || 0) + 1,
        });
      }

      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setModalError(err.message || 'Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuickImage = async () => {
    if (!imageChangeCategory || !quickImageUrl.trim()) return;

    setIsQuickImageSaving(true);
    try {
      await updateCategoryImage(imageChangeCategory.id, quickImageUrl.trim());
      setImageChangeCategory(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsQuickImageSaving(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    if (!categories || categories.length < 2) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const list = [...categories];
    const item = list[index];
    list.splice(index, 1);
    list.splice(newIdx, 0, item);

    // Reassign displayOrder values
    const updatedList = list.map((cat, idx) => ({
      ...cat,
      displayOrder: idx + 1,
    }));

    await reorderCategories(updatedList);
  };

  const handleToggleFeatured = async (cat: Category) => {
    const nextFeatured = !(cat.isFeatured ?? cat.featured ?? false);
    await updateCategory(cat.id, {
      featured: nextFeatured,
      isFeatured: nextFeatured,
    });
  };

  const filteredCategories = (categories || []).filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.slug && c.slug.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query))
    );
  });

  const totalCategoriesCount = categories?.length || 0;
  const featuredCategoriesCount = (categories || []).filter(
    (c) => (c.isFeatured ?? c.featured ?? false)
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Categories
            </span>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">
              {totalCategoriesCount} Collections
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Configured on store catalog
            </p>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Homepage Featured
            </span>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {featuredCategoriesCount} Active
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Visible on home category grid
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
              Catalog Products
            </span>
            <p className="text-2xl font-black text-amber-600 font-mono mt-1">
              {products.length} Products
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Assigned across categories
            </p>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Create New Category */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Category Management & Catalog Taxonomy</span>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                {totalCategoriesCount} Active
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, reorder, edit category titles, and change showcase banner images displayed on the website.
            </p>
          </div>

          <button
            id="admin-create-category-btn"
            onClick={handleOpenAddCategory}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category by title, slug, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat, index) => {
          const productCount = getCategoryProductCount(cat.name);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Category Image Header */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={cat.image || CATEGORY_PRESET_IMAGES[0].url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = CATEGORY_PRESET_IMAGES[0].url;
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border border-white/20">
                    Order #{cat.displayOrder ?? index + 1}
                  </span>

                  <button
                    onClick={() => handleToggleFeatured(cat)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors backdrop-blur-xs ${
                      (cat.isFeatured ?? cat.featured ?? false)
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-900/70 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{(cat.isFeatured ?? cat.featured ?? false) ? 'Featured on Home' : 'Standard'}</span>
                  </button>
                </div>

                {/* Change Image Button Overlay */}
                <button
                  onClick={() => handleOpenQuickImageModal(cat)}
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-all hover:scale-102"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Change Image</span>
                </button>

                {/* Category Title & Product Count Overlay */}
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-sm font-black text-white leading-tight drop-shadow-xs">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-amber-300 font-bold font-mono">
                    {productCount} {productCount === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="text-[11px] text-slate-400">Slug Identifier:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                      /{cat.slug || generateSlug(cat.name)}
                    </span>
                  </div>

                  {cat.description ? (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-2">
                      No custom description provided.
                    </p>
                  )}
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveCategory(index, 'up')}
                      title="Move Up in Menu"
                      className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === (categories?.length || 0) - 1}
                      onClick={() => handleMoveCategory(index, 'down')}
                      title="Move Down in Menu"
                      className="p-1 text-slate-600 hover:text-slate-950 disabled:opacity-30 rounded-lg hover:bg-white transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* View Products */}
                    <button
                      onClick={() => {
                        if (onNavigateToProductsWithCategory) {
                          onNavigateToProductsWithCategory(cat.name);
                        } else {
                          setFilterState((prev) => ({ ...prev, category: cat.name, searchQuery: '' }));
                          setCurrentPage('shop');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Products ({productCount})</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Edit Category Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No categories found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery
                ? `No category matched "${searchQuery}". Try a different keyword.`
                : 'No categories exist in your store yet. Click "Create New Category" to add your first catalog category.'}
            </p>
          </div>
          <button
            onClick={handleOpenAddCategory}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>
      )}

      {/* FULL CREATE / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsCategoryModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {editingCategory ? `Update "${editingCategory.name}"` : 'Add New Store Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveCategory} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1 text-xs">
                    Category Title / Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Wireless Earbuds, Smart Watches"
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setCategoryForm((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug === generateSlug(prev.name) || !prev.slug ? generateSlug(name) : prev.slug,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    URL Slug Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. wireless-earbuds"
                    value={categoryForm.slug}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-medium text-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Category Image Section */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Category Showcase & Banner Image</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Shown on Homepage & Navigation
                  </span>
                </div>

                {/* Live Preview Box */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 border-2 border-indigo-500 shrink-0 relative shadow-inner">
                    <img
                      src={categoryForm.image || CATEGORY_PRESET_IMAGES[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = CATEGORY_PRESET_IMAGES[0].url;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-950/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Direct Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={categoryForm.image}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, image: e.target.value })
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCategoryFormFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Or pick from smart accessory presets below:
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preset Images Grid */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Curated Accessory Preset Photos:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                    {CATEGORY_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setCategoryForm((prev) => ({ ...prev, image: preset.url }))
                        }
                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          categoryForm.image === preset.url
                            ? 'border-indigo-600 ring-2 ring-indigo-200'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                          <span className="text-[9px] text-white font-bold leading-tight line-clamp-1">
                            {preset.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">
                  Category Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description for category banner and SEO..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              {/* Order & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={categoryForm.displayOrder}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        displayOrder: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Lower numbers show first in menus and homepage.
                  </p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer w-full transition-colors">
                    <input
                      type="checkbox"
                      checked={categoryForm.featured}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        Feature on Homepage
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Display in the top TWAKX collections grid
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK CATEGORY IMAGE CHANGE MODAL */}
      {imageChangeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setImageChangeCategory(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                  Quick Image Update
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Change Image for "{imageChangeCategory.name}"
                </h3>
              </div>
              <button
                onClick={() => setImageChangeCategory(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Image Comparison Preview */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Current</span>
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={imageChangeCategory.image || CATEGORY_PRESET_IMAGES[0].url}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <span className="text-slate-300 font-bold text-lg">→</span>

              <div className="text-center">
                <span className="text-[10px] text-indigo-600 font-bold block mb-1">New Image</span>
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-600 bg-slate-100 shadow-md">
                  <img
                    src={quickImageUrl || CATEGORY_PRESET_IMAGES[0].url}
                    alt="New Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CATEGORY_PRESET_IMAGES[0].url;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Image URL
              </label>
              <input
                type="url"
                value={quickImageUrl}
                onChange={(e) => setQuickImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* File Upload Button */}
            <div className="flex items-center justify-between">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Upload From Computer / Phone</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQuickImageFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
            </div>

            {/* Preset Thumbnails */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Or choose from popular presets:
              </span>
              <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                {CATEGORY_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuickImageUrl(preset.url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      quickImageUrl === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImageChangeCategory(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isQuickImageSaving || !quickImageUrl.trim()}
                onClick={handleSaveQuickImage}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isQuickImageSaving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Apply New Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setDeletingCategory(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete Category "{deletingCategory.name}"?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this category from the store catalog?
              </p>
            </div>

            {/* Category Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={deletingCategory.image || CATEGORY_PRESET_IMAGES[0].url}
                alt={deletingCategory.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
              />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-bold text-slate-900 text-xs line-clamp-1">
                  {deletingCategory.name}
                </p>
                <p className="text-[10px] text-amber-600 font-medium">
                  {getCategoryProductCount(deletingCategory.name)} Products currently in this category
                </p>
              </div>
            </div>

            {getCategoryProductCount(deletingCategory.name) > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Products in this category will remain in the catalog, but their category tag may need updating.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteCategory}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {isDeleting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
