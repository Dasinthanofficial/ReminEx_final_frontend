import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
    weight: "",
    image: "", // can be file or URL
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("expiryDate", form.expiryDate);
      if (form.price) fd.append("price", form.price);
      if (form.weight) fd.append("weight", form.weight);
      if (file) fd.append("image", file);
      else if (form.image) fd.append("image", form.image); // URL case

      await productService.addProduct(fd);
      toast.success("Product added successfully!");
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add product";
      toast.error(msg);
      console.error(err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border w-full p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        >
          <option value="Food">Food</option>
          <option value="Non-Food">Non-Food</option>
        </select>

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="border w-full p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border w-full p-2 rounded"
        />

        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="Weight (g)"
          className="border w-full p-2 rounded"
        />

        <label className="block font-semibold">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}

        <div className="mt-2 text-sm text-gray-600">Or paste image URL</div>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="border w-full p-2 rounded"
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <Link
            to="/products"
            className="flex-1 text-center bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;