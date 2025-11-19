import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
        if (data.image && data.image.startsWith("http")) setPreview(data.image);
      } catch {
        toast.error("Failed to load product.");
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
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
      const fd = new FormData();
      fd.append("name", product.name);
      fd.append("category", product.category);
      fd.append("expiryDate", product.expiryDate);
      if (product.price) fd.append("price", product.price);
      if (product.weight) fd.append("weight", product.weight);
      if (file) fd.append("image", file);
      else if (product.image) fd.append("image", product.image);

      await productService.updateProduct(id, fd);
      toast.success("Product updated!");
      navigate("/products");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed.";
      toast.error(msg);
      console.error(err.response?.data || err);
    }
  };

  if (!product) return <p className="p-6">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        >
          <option value="Food">Food</option>
          <option value="Non-Food">Non-Food</option>
        </select>

        <input
          type="date"
          name="expiryDate"
          value={product.expiryDate?.slice(0, 10) || ""}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleChange}
          placeholder="Price"
          className="border w-full p-2 rounded"
        />

        <input
          type="number"
          name="weight"
          value={product.weight || ""}
          onChange={handleChange}
          placeholder="Weight (g)"
          className="border w-full p-2 rounded"
        />

        <div>
          <label className="block font-semibold">Change Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}

          <p className="text-sm text-gray-500 mt-2">or paste URL</p>
          <input
            type="url"
            name="image"
            value={product.image || ""}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          />
        </div>

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;