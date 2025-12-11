import { useEffect, useState } from "react";
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
import { formatPrice, convertLocalToUSD } from "../utils/currencyHelper"; // ✅ added convertLocalToUSD
import toast from "react-hot-toast";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-[#38E07B] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const Dashboard = () => {
  const { user, currency } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const [userData, prodData] = await Promise.all([
        api.get("/user/dashboard"),
        api.get("/products"),
      ]);
      // api.get already returns JSON body
      setUserInfo(userData);
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

  const handleAddProduct = async (formData) => {
    try {
      const payload = { ...formData };

      if (payload.price) {
        payload.price = convertLocalToUSD(
          parseFloat(payload.price),
          currency
        );
      }

      await api.post("/products", payload);
      toast.success("Product added successfully!");
      setShowAddModal(false);
      fetchData();
    } catch (e) {
      toast.error("Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const expiringSoon = products.filter((p) => {
    const days =
      (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-[#122017] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      {/* 🌌 Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#38E07B]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              Hello,{" "}
              <span className="text-[#38E07B]">{user?.name}</span>! 👋
            </h1>
            <p className="text-gray-400 text-sm">
              Here's an overview of your inventory.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#38E07B] text-[#122017] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2fc468] transition-all flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Products"
            value={products.length}
            icon={<FiPackage />}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            title="Expiring Soon"
            value={expiringSoon}
            icon={<FiCalendar />}
            color="bg-yellow-500/20 text-yellow-400"
          />
          <StatCard
            title="Total Value"
            value={formatPrice(totalValue, currency)}
            icon={<FiTrendingUp />}
            color="bg-[#38E07B]/20 text-[#38E07B]"
          />
        </div>

        {/* 📋 Product List */}
        <h2 className="text-2xl font-bold mb-6 text-white">
          Recent Inventory
        </h2>

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
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <p className="text-gray-400 text-lg">
              No products found. Start adding some!
            </p>
          </div>
        )}
      </div>

      {/* ➕ Add Product Modal */}
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

// 🧱 Sub-Components

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-lg flex items-center gap-4"
  >
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}
    >
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

const ProductCard = ({ product, onDelete, currency }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-5 shadow-lg relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button
        onClick={onDelete}
        className="bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all"
      >
        <FiTrash2 />
      </button>
    </div>

    <div className="h-40 bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          {product.category === "Food" ? "🥗" : "📦"}
        </div>
      )}
      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-md">
        {product.category}
      </span>
    </div>

    <h3 className="text-lg font-bold text-white truncate">
      {product.name}
    </h3>
    <div className="flex justify-between items-end mt-2">
      <div>
        <p className="text-xs text-gray-400">Expires</p>
        <p className="text-sm font-medium text-gray-200">
          {new Date(product.expiryDate).toLocaleDateString()}
        </p>
      </div>
      {product.price && (
        <div className="bg-[#38E07B]/20 text-[#38E07B] px-3 py-1 rounded-lg text-sm font-bold">
          {formatPrice(product.price, currency)}
        </div>
      )}
    </div>
  </motion.div>
);

const AddProductModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-[#1a2c23] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect inside modal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#38E07B]/10 rounded-full blur-[50px] pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Add New Item</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
              Name
            </label>
            <input
              placeholder="Product Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none mt-1"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                Category
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#38E07B] outline-none mt-1"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                defaultValue="Food"
              >
                <option value="Food">Food</option>
                <option value="Non-Food">Non-Food</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#38E07B] outline-none mt-1"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
              Expiry Date
            </label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-[#38E07B] outline-none mt-1"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, expiryDate: e.target.value }))
              }
            />
          </div>

          <button
            onClick={() => onSubmit(form)}
            className="w-full bg-[#38E07B] text-[#122017] font-bold py-3 rounded-xl hover:bg-[#2fc468] transition mt-4"
          >
            Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;