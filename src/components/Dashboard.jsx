import { useEffect, useState } from "react";
import api from "../api/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { Modal } from "../components/Modal";
import { Toast } from "../components/Toast";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Load user profile
  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/api/user/dashboard");
      setUserInfo(data);
    } catch (e) {
      setToast({ 
        message: e.response?.data?.message || "Failed to load user data", 
        type: "error" 
      });
      console.error(e);
    } finally {
      setLoadingUser(false);
    }
  };

  // Load products
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await api.get("/api/products");
      // Ensure products is always an array
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setToast({ 
        message: e.response?.data?.message || "Failed to load products", 
        type: "error" 
      });
      setProducts([]); // Set to empty array on error
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    loadProducts();
  }, []);

  // Add product handler
  const handleAddProduct = async (product) => {
    try {
      await api.post("/api/products", product);
      setToast({ message: "Product added!", type: "success" });
      setShowAddModal(false);
      loadProducts(); // Refresh the product list
    } catch (e) {
      setToast({
        message: e.response?.data?.message || "Failed to add product",
        type: "error",
      });
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setToast({ message: "Product deleted", type: "success" });
      loadProducts(); // Refresh the product list
    } catch (e) {
      setToast({ 
        message: e.response?.data?.message || "Delete failed", 
        type: "error" 
      });
    }
  };

  if (loadingUser) {
    return <LoadingSpinner />;
  }

  const isPremium = user?.plan === "Monthly" || user?.plan === "Yearly";

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {userInfo?.name}!
      </h1>

      {/* Profile summary */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <p className="text-gray-700">
          <strong>Plan:</strong> {userInfo?.plan}
          {userInfo?.planExpiry && (
            <span className="ml-2 text-sm">
              (expires {formatDate(userInfo.planExpiry)})
            </span>
          )}
        </p>
        <p className="text-gray-700">
          <strong>Products stored:</strong> {userInfo?.productCount || 0}
          {userInfo?.plan === "Free" && " / 5"}
        </p>
        {userInfo?.plan === "Free" && (
          <Link 
            to="/plans" 
            className="inline-block mt-2 text-indigo-600 hover:underline"
          >
            Upgrade to Premium
          </Link>
        )}
      </section>

      {/* Add product button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Products</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add Product
        </button>
      </div>

      {/* Product list */}
      {loadingProducts ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={() => handleDelete(product._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Add some to get started!</p>
        </div>
      )}

      {/* Add product modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Product">
          <AddProductForm 
            onSubmit={handleAddProduct} 
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// AddProductForm component
function AddProductForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: new Date().toISOString().split('T')[0], // Set default to today
    price: "",
    weight: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="Food">Food</option>
          <option value="Non-Food">Non-Food</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price (optional)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Weight (g) (optional)</label>
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}