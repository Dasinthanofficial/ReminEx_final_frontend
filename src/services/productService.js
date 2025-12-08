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

  // ✅ Translate recipe text to any language
  translateRecipe: (text, targetLang) =>
    api.post("/products/translate", { text, targetLang }),

  // ✅ Saved recipes
  getSavedRecipes: () => api.get("/products/recipes/saved"),
  saveRecipe: (payload) => api.post("/products/recipes/save", payload),
  deleteSavedRecipe: (id) => api.delete(`/products/recipes/${id}`),
};