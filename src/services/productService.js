import api from "./api";

export const productService = {
  getProducts: () => api.get("/products"),
  getProduct: (id) => api.get(`/products/${id}`),

  // ✅ Add product (handles FormData)
  addProduct: (data) =>
    api.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // ✅ Update product (handles FormData)
  updateProduct: (id, data) =>
    api.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  // ✅ AI recipe suggestions
  getRecipeSuggestion: () => api.post("/products/recipe"),

  // ✅ NEW: translate recipe text to any language (e.g., Tamil)
  translateRecipe: (text, targetLang) =>
    api.post("/products/translate", { text, targetLang }),
};