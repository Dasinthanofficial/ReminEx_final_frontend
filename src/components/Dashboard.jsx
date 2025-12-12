import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiPackage,
  FiCalendar,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { formatPrice, convertLocalToUSD } from "../utils/currencyHelper";
import { getImageUrl } from "../utils/imageHelper";
import toast from "react-hot-toast";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-[#38E07B] border-t-transparent rounded-full animate-spin" />
  </div>
);

const startOfToday = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

const daysUntil = (date) => {
  const today = startOfToday();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
};

const expiryBadge = (d) => {
  if (d < 0) return { text: "Expired", cls: "bg-red-500/15 text-red-300 border-red-500/25" };
  if (d === 0) return { text: "Today", cls: "bg-red-500/15 text-red-300 border-red-500/25" };
  if (d <= 3) return { text: `${d} day${d === 1 ? "" : "s"} left`, cls: "bg-orange-500/15 text-orange-300 border-orange-500/25" };
  if (d <= 7) return { text: `${d} days left`, cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25" };
  return { text: "Fresh", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" };
};

export const Dashboard = () => {
  const { user, currency } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const prodData = await api.get("/products");
      setProducts(Array.isArray(prodData) ? prodData : []);
    } catch (e) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const expiringSoon = products.filter((p) => {
      const d = daysUntil(p.expiryDate);
      return d >= 0 && d <= 7;
    }).length;

    return { totalValue, expiringSoon };
  }, [products]);

  const handleAddProduct = async (form) => {
    try {
      const payload = {
        name: form.name?.trim(),
        category: form.category,
        expiryDate: form.expiryDate,
        price: form.price ? convertLocalToUSD(parseFloat(form.price), currency) : undefined,
      };

      await api.post("/products", payload);

      toast.success("Product added successfully!");
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#122017] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] bg-[#38E07B]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              Hello, <span className="text-[#38E07B]">{user?.name}</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Here’s an overview of your inventory.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#38E07B] text-[#122017] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2fc468] transition-all flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Products"
            value={products.length}
            icon={<FiPackage />}
            color="bg-blue-500/20 text-blue-300"
          />
          <StatCard
            title="Expiring Soon (≤ 7 days)"
            value={stats.expiringSoon}
            icon={<FiCalendar />}
            color="bg-yellow-500/20 text-yellow-300"
          />
          <StatCard
            title="Total Value"
            value={formatPrice(stats.totalValue, currency)}
            icon={<FiTrendingUp />}
            color="bg-[#38E07B]/20 text-[#38E07B]"
          />
        </div>

        {/* Product List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Inventory</h2>
          <p className="text-xs text-gray-400">
            Sorted by newest
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                currency={currency}
                onDelete={() => handleDelete(product._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-gray-300 text-lg font-semibold mb-2">No products yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Add your first product to start tracking expiry dates.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-[#38E07B] text-[#122017] px-6 py-3 rounded-xl font-bold hover:bg-[#2fc468] transition"
            >
              <FiPlus /> Add Product
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddProductModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-lg flex items-center gap-4"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm uppercase font-bold tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </motion.div>
);

const ProductCard = ({ product, onDelete, currency }) => {
  const imgSrc = getImageUrl(product.image);
  const d = daysUntil(product.expiryDate);
  const badge = expiryBadge(d);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-lg relative group overflow-hidden"
    >
      {/* delete button */}
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={onDelete}
          className="bg-red-500/20 text-red-300 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
          title="Delete"
        >
          <FiTrash2 />
        </button>
      </div>

      {/* Image */}
      <div className="h-40 bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {product.category === "Food" ? "🥗" : "📦"}
          </div>
        )}

        {/* Category pill */}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-md">
          {product.category}
        </span>

        {/* Expiry badge */}
        <span className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 rounded-lg border backdrop-blur-md ${badge.cls}`}>
          {badge.text}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>

      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-xs text-gray-500">Expires</p>
          <p className="text-sm font-medium text-gray-200">
            {new Date(product.expiryDate).toLocaleDateString()}
          </p>
        </div>

        {!!product.price && (
          <div className="bg-[#38E07B]/20 text-[#38E07B] px-3 py-1 rounded-lg text-sm font-bold border border-[#38E07B]/20">
            {formatPrice(product.price, currency)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AddProductModal = ({ onClose, onSubmit }) => {
  const todayISO = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
  });

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.category &&
    form.expiryDate &&
    (!form.price || Number(form.price) >= 0);

  const submit = () => {
    if (!canSubmit) {
      toast.error("Please fill Name + Expiry Date correctly");
      return;
    }
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onMouseDown={(e) => {
        // close when clicking outside modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        className="bg-[#1a2c23] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38E07B]/10 rounded-full blur-[50px] pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          title="Close"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Add New Item</h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
              Name
            </label>
            <input
              value={form.name}
              placeholder="Product Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none mt-1"
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                Category
              </label>
              <select
                value={form.category}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 focus:border-[#38E07B] outline-none mt-1"
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="Food">Food</option>
                <option value="Non-Food">Non-Food</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                Price ({/* local */} {""})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none mt-1"
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
              Expiry Date
            </label>
            <input
              type="date"
              min={todayISO}
              value={form.expiryDate}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-200 focus:border-[#38E07B] outline-none mt-1"
              onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Must be today or later.
            </p>
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            className="w-full bg-[#38E07B] text-[#122017] font-bold py-3 rounded-xl hover:bg-[#2fc468] transition mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;